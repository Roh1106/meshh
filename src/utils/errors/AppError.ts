export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info';
export type ErrorCategory = 
  | 'network' 
  | 'offline' 
  | 'validation' 
  | 'file' 
  | 'database' 
  | 'sync' 
  | 'permission' 
  | 'unknown';

export class AppError extends Error {
  public readonly code: string;
  public readonly userMessage: string;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly timestamp: string;
  public readonly technicalDetails?: unknown;

  constructor(options: {
    message: string;
    userMessage: string;
    code?: string;
    category?: ErrorCategory;
    severity?: ErrorSeverity;
    technicalDetails?: unknown;
  }) {
    super(options.message);
    this.name = 'AppError';
    this.code = options.code || 'UNKNOWN_ERROR';
    this.userMessage = options.userMessage;
    this.category = options.category || 'unknown';
    this.severity = options.severity || 'error';
    this.timestamp = new Date().toISOString();
    this.technicalDetails = options.technicalDetails;
  }
}

export function normalizeError(error: unknown, fallbackMessage = 'An unexpected error occurred. Your local data remains safe.'): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Check for offline / network indicators
    if (!navigator.onLine || error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('fetch')) {
      return new AppError({
        message: error.message,
        userMessage: 'You appear to be offline or on an unstable network. Offline campus data is still accessible.',
        code: 'NETWORK_OFFLINE',
        category: 'offline',
        technicalDetails: error,
      });
    }

    return new AppError({
      message: error.message,
      userMessage: fallbackMessage,
      code: 'GENERIC_ERROR',
      technicalDetails: error.stack,
    });
  }

  return new AppError({
    message: String(error),
    userMessage: fallbackMessage,
    code: 'UNKNOWN_ERROR',
    technicalDetails: error,
  });
}
