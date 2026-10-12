import Dexie, { type Table } from 'dexie';
import type { ProjectRecord, SettingRecord, MetadataRecord } from '@/db/schema';

export class PropertyDatabase extends Dexie {
  projects!: Table<ProjectRecord, string>;
  settings!: Table<SettingRecord, string>;
  metadata!: Table<MetadataRecord, string>;

  constructor() {
    super('hong-kong-property-table-builder');
    this.version(1).stores({
      projects:
        'id, projectNameZh, projectNameEn, developer, district, districtDetail, updatedAt, createdAt, isDemo',
      settings: 'key',
      metadata: 'key',
    });
  }
}

export const db = new PropertyDatabase();
