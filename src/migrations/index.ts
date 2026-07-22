import * as migration_20260722_122251_initial from './20260722_122251_initial';
import * as migration_20260722_122949_add_lead_slugs from './20260722_122949_add_lead_slugs';

export const migrations = [
  {
    up: migration_20260722_122251_initial.up,
    down: migration_20260722_122251_initial.down,
    name: '20260722_122251_initial',
  },
  {
    up: migration_20260722_122949_add_lead_slugs.up,
    down: migration_20260722_122949_add_lead_slugs.down,
    name: '20260722_122949_add_lead_slugs'
  },
];
