export type LogCategory =
  | 'AUTH'
  | 'DATABASE'
  | 'RESOURCE'
  | 'SYNC'
  | 'NETWORK'
  | 'TEST'
  | 'SECURITY'
  | 'UI';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  category: LogCategory;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

class Logger {
  private isDev = process.env.NODE_ENV !== 'production';
  private logs: LogEntry[] = [];
  private maxLogs = 200;

  // Redact potentially sensitive keys
  private sanitize(obj?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!obj) return undefined;
    const sensitive = ['password', 'token', 'secret', 'auth', 'cookie', 'credential'];
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (sensitive.some((s) => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        sanitized[key] = this.sanitize(val as Record<string, unknown>);
      } else {
        sanitized[key] = val;
      }
    }
    return sanitized;
  }

  private write(level: LogLevel, category: LogCategory, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      category,
      level,
      message,
      context: this.sanitize(context),
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    if (this.isDev) {
      const prefix = `[SkillMesh:${category}]`;
      switch (level) {
        case 'debug':
          console.debug(prefix, message, entry.context || '');
          break;
        case 'info':
          console.info(prefix, message, entry.context || '');
          break;
        case 'warn':
          console.warn(prefix, message, entry.context || '');
          break;
        case 'error':
          console.error(prefix, message, entry.context || '');
          break;
      }
    }
  }

  debug(category: LogCategory, message: string, context?: Record<string, unknown>) {
    this.write('debug', category, message, context);
  }

  info(category: LogCategory, message: string, context?: Record<string, unknown>) {
    this.write('info', category, message, context);
  }

  warn(category: LogCategory, message: string, context?: Record<string, unknown>) {
    this.write('warn', category, message, context);
  }

  error(category: LogCategory, message: string, context?: Record<string, unknown>) {
    this.write('error', category, message, context);
  }

  getRecentLogs(limit = 50): LogEntry[] {
    return this.logs.slice(0, limit);
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
