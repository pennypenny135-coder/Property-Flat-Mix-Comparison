import type { Project } from './project';

export const BACKUP_APP_NAME = 'Hong Kong Property Table Builder';
export const BACKUP_VERSION = 2;

export type BackupFile = {
  appName: string;
  version: number;
  exportedAt: string;
  projects: Project[];
  settings: Record<string, unknown>;
};

export type ImportMode = 'merge' | 'replace';

export type DuplicateStrategy = 'skip' | 'update';

export type ImportValidationError = {
  index: number;
  identifier: string;
  reason: string;
};

export type ImportPreviewResult = {
  fileName: string;
  fileType: 'json' | 'csv';
  totalCount: number;
  newCount: number;
  duplicateCount: number;
  invalidCount: number;
  errors: ImportValidationError[];
  legacyPercentageFound: boolean;
  legacyUnitsPerSpaceFound: boolean;
  validProjects: Project[];
  duplicateIds: string[];
};
