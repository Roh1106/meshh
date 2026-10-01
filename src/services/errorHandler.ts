import { AppError, normalizeError } from '../utils/errors/AppError';

type ErrorListener = (error: AppError) => void;
const listeners: Set<ErrorListener> = new Set();

export const errorHandler = {
  subscribe(listener: ErrorListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  handle(error: unknown, fallbackMessage?: string): AppError {
    const normalized = normalizeError(error, fallbackMessage);
    
    // Log technical details safely to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[SkillMesh:${normalized.code}]`, normalized.message, normalized.technicalDetails);
    }

    listeners.forEach((listener) => {
      try {
        listener(normalized);
      } catch (err) {
        console.error('Error in error listener', err);
      }
    });

    return normalized;
  },
};
