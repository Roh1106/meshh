import { AcademicResource } from '../types';
import { resourcesRepository } from '../repositories';
import { logger } from '../utils/logger';

export interface ResourceUploadInput {
  file: File;
  title: string;
  description: string;
  subject: string;
  topic: string;
  semester: string;
  department: string;
  language: string;
  authorName: string;
}

export interface ValidationResult {
  isValid: boolean;
  status: 'Verified' | 'Pending validation' | 'Rejected' | 'Flagged';
  errors: string[];
  warnings: string[];
  contentHash: string;
  fileSizeFormatted: string;
  duplicateResource?: AcademicResource;
}

export const resourceValidationService = {
  /**
   * Generates a cryptographic SHA-256 fingerprint of the binary data.
   */
  async computeFileHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Formats raw bytes to human readable string (e.g. 2.4 MB).
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  },

  /**
   * Full pipeline validation of uploaded academic PDF resource.
   */
  async validateAndPrepare(input: ResourceUploadInput): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Mandatory metadata fields check
    if (!input.title || input.title.trim().length < 5) {
      errors.push('Title is required and must be at least 5 characters.');
    }
    if (!input.description || input.description.trim().length < 15) {
      errors.push('Description is required (minimum 15 characters) explaining what the PDF covers.');
    }
    if (!input.subject || !input.topic) {
      errors.push('Both academic Subject and Topic are required for syllabus mapping.');
    }

    // 2. File extension check
    const extension = input.file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf') {
      errors.push('Upload rejected: only valid academic PDF documents are permitted.');
    }

    // 3. MIME type check
    if (input.file.type && input.file.type !== 'application/pdf') {
      errors.push('Invalid file MIME type. The file must be an authentic PDF.');
    }

    // 4. File size limits (Max 25 MB)
    const MAX_SIZE_BYTES = 25 * 1024 * 1024;
    if (input.file.size > MAX_SIZE_BYTES) {
      errors.push('File size exceeds the 25 MB campus mesh transmission limit.');
    }
    if (input.file.size < 512) {
      errors.push('Upload rejected: file appears empty or unreadable.');
    }

    // Return early if basic validation fails
    if (errors.length > 0) {
      logger.warn('RESOURCE', 'Resource failed initial validation checks', { errors });
      return {
        isValid: false,
        status: 'Rejected',
        errors,
        warnings,
        contentHash: '',
        fileSizeFormatted: this.formatBytes(input.file.size),
      };
    }

    // 5. Generate content hash (SHA-256)
    const contentHash = await this.computeFileHash(input.file);

    // 6. Duplicate detection against existing database
    const existing = await resourcesRepository.getAll();
    const duplicate = existing.find(
      (r) =>
        r.title.toLowerCase() === input.title.trim().toLowerCase() ||
        (r.fileSize === this.formatBytes(input.file.size) && r.subject.toLowerCase() === input.subject.toLowerCase())
    );

    if (duplicate) {
      warnings.push(`Potential duplicate detected: matches "${duplicate.title}" uploaded by ${duplicate.author}.`);
    }

    // 7. Relevance heuristics: compare title keywords to description
    const titleWords = input.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const descWords = input.description.toLowerCase();
    const matchedKeywords = titleWords.filter((w) => descWords.includes(w));

    let status: 'Verified' | 'Pending validation' | 'Flagged' = 'Pending validation';
    if (matchedKeywords.length >= 1) {
      status = 'Verified';
    } else {
      warnings.push('Content could not be confidently matched to the description. Resource sent for peer review.');
    }

    logger.info('RESOURCE', `Resource validated successfully. Status: ${status}`, {
      hash: contentHash.slice(0, 10),
      size: this.formatBytes(input.file.size),
    });

    return {
      isValid: true,
      status,
      errors,
      warnings,
      contentHash,
      fileSizeFormatted: this.formatBytes(input.file.size),
      duplicateResource: duplicate,
    };
  },
};
