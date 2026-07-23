import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contact_settings" ADD COLUMN IF NOT EXISTS "socials_youtube" varchar;
    ALTER TABLE "contact_settings" ADD COLUMN IF NOT EXISTS "socials_snapchat" varchar;
    ALTER TABLE "contact_settings" ADD COLUMN IF NOT EXISTS "socials_tiktok" varchar;
    ALTER TABLE "contact_settings" ADD COLUMN IF NOT EXISTS "socials_facebook" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contact_settings" DROP COLUMN IF EXISTS "socials_youtube";
    ALTER TABLE "contact_settings" DROP COLUMN IF EXISTS "socials_snapchat";
    ALTER TABLE "contact_settings" DROP COLUMN IF EXISTS "socials_tiktok";
    ALTER TABLE "contact_settings" DROP COLUMN IF EXISTS "socials_facebook";
  `)
}
