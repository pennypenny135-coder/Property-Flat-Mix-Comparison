import type { Project } from './project';

export type ComparisonColumn = {
  project: Project;
  index: number;
};

export type SortOption = {
  key: string;
  label: string;
};
