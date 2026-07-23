import * as migration_20260722_122251_initial from './20260722_122251_initial';
import * as migration_20260722_122949_add_lead_slugs from './20260722_122949_add_lead_slugs';
import * as migration_20260722_162042_add_about_quality_pages from './20260722_162042_add_about_quality_pages';
import * as migration_20260723_000000_add_social_fields from './20260723_000000_add_social_fields';

export const migrations = [
  {
    up: migration_20260722_122251_initial.up,
    down: migration_20260722_122251_initial.down,
    name: '20260722_122251_initial',
  },
  {
    up: migration_20260722_122949_add_lead_slugs.up,
    down: migration_20260722_122949_add_lead_slugs.down,
    name: '20260722_122949_add_lead_slugs',
  },
  {
    up: migration_20260722_162042_add_about_quality_pages.up,
    down: migration_20260722_162042_add_about_quality_pages.down,
    name: '20260722_162042_add_about_quality_pages'
  },
  {
    up: migration_20260723_000000_add_social_fields.up,
    down: migration_20260723_000000_add_social_fields.down,
    name: '20260723_000000_add_social_fields',
  },
];
