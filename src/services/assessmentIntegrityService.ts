import { TestViolation, ViolationType, TestAttempt } from '../types';
import { testsRepository } from '../repositories';
import { logger } from '../utils/logger';

export interface IntegrityListener {
  onViolation: (violation: TestViolation, totalViolations: number, actionRequired: 'warn' | 'final_warning' | 'auto_submit') => void;
  onFullscreenChange: (isFullscreen: boolean) => void;
}

export class AssessmentIntegrityMonitor {
  private attemptId: string;
  private listeners: Set<IntegrityListener> = new Set();
  private sequence = 0;
  private isMonitoring = false;
  private violationCount = 0;

  constructor(attemptId: string, initialViolationsCount = 0) {
    this.attemptId = attemptId;
    this.violationCount = initialViolationsCount;
  }

  public subscribe(listener: IntegrityListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public start() {
    if (this.isMonitoring || typeof window === 'undefined') return;
    this.isMonitoring = true;

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('blur', this.handleWindowBlur);
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);

    logger.info('TEST', `Assessment integrity monitoring initialized for attempt: ${this.attemptId}`);
  }

  public stop() {
    if (!this.isMonitoring || typeof window === 'undefined') return;
    this.isMonitoring = false;

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('blur', this.handleWindowBlur);
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);

    logger.info('TEST', `Assessment integrity monitoring stopped for attempt: ${this.attemptId}`);
  }

  public async requestFullscreen(): Promise<boolean> {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        return true;
      }
    } catch (err) {
      logger.warn('TEST', 'Fullscreen request denied or not supported by browser environment', { error: err });
    }
    return false;
  }

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.recordViolation('PAGE_HIDDEN', 'Assessment window was minimized or tab was switched.');
    }
  };

  private handleWindowBlur = () => {
    // Only register blur if page is still visible (to avoid double reporting with hidden)
    if (!document.hidden) {
      this.recordViolation('WINDOW_BLUR', 'Focus moved away from the assessment workspace.');
    }
  };

  private handleFullscreenChange = () => {
    const isFullscreen = !!document.fullscreenElement;
    this.listeners.forEach((l) => l.onFullscreenChange(isFullscreen));
    if (!isFullscreen && this.isMonitoring) {
      this.recordViolation('FULLSCREEN_EXIT', 'Fullscreen assessment display was exited.');
    }
  };

  private async recordViolation(type: ViolationType, details: string) {
    this.sequence += 1;
    this.violationCount += 1;

    const violation: TestViolation = {
      id: `viol_${Date.now()}_${this.sequence}`,
      attemptId: this.attemptId,
      type,
      timestamp: new Date().toISOString(),
      sequenceNumber: this.sequence,
      details,
    };

    // Save into repository
    await testsRepository.logViolation(this.attemptId, violation);

    let action: 'warn' | 'final_warning' | 'auto_submit' = 'warn';
    if (this.violationCount === 1) {
      action = 'warn';
    } else if (this.violationCount === 2) {
      action = 'final_warning';
    } else {
      action = 'auto_submit';
    }

    this.listeners.forEach((l) => l.onViolation(violation, this.violationCount, action));
  }
}
