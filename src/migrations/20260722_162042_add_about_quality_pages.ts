import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_page_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_page_values_locales" (
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_why" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_page_why_locales" (
  	"item" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"story_image_id" integer,
  	"side_image_id" integer,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar NOT NULL,
  	"story_title" varchar NOT NULL,
  	"story_body" varchar NOT NULL,
  	"mission_section_section_title" varchar NOT NULL,
  	"mission_section_vision_label" varchar NOT NULL,
  	"mission_section_vision_body" varchar NOT NULL,
  	"mission_section_mission_label" varchar NOT NULL,
  	"mission_section_mission_body" varchar NOT NULL,
  	"values_label" varchar,
  	"why_title" varchar NOT NULL,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "quality_safety_page_commitments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "quality_safety_page_commitments_locales" (
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "quality_safety_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "quality_safety_page_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar NOT NULL,
  	"certifications_section_title" varchar NOT NULL,
  	"certifications_section_note" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "about_page_values" ADD CONSTRAINT "about_page_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_values_locales" ADD CONSTRAINT "about_page_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_why" ADD CONSTRAINT "about_page_why_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_why_locales" ADD CONSTRAINT "about_page_why_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_why"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_story_image_id_media_id_fk" FOREIGN KEY ("story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_side_image_id_media_id_fk" FOREIGN KEY ("side_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quality_safety_page_commitments" ADD CONSTRAINT "quality_safety_page_commitments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quality_safety_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quality_safety_page_commitments_locales" ADD CONSTRAINT "quality_safety_page_commitments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quality_safety_page_commitments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quality_safety_page" ADD CONSTRAINT "quality_safety_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quality_safety_page" ADD CONSTRAINT "quality_safety_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quality_safety_page_locales" ADD CONSTRAINT "quality_safety_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quality_safety_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_page_values_order_idx" ON "about_page_values" USING btree ("_order");
  CREATE INDEX "about_page_values_parent_id_idx" ON "about_page_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_values_locales_locale_parent_id_unique" ON "about_page_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_why_order_idx" ON "about_page_why" USING btree ("_order");
  CREATE INDEX "about_page_why_parent_id_idx" ON "about_page_why" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_why_locales_locale_parent_id_unique" ON "about_page_why_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_story_story_image_idx" ON "about_page" USING btree ("story_image_id");
  CREATE INDEX "about_page_side_image_idx" ON "about_page" USING btree ("side_image_id");
  CREATE INDEX "about_page_seo_seo_og_image_idx" ON "about_page" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "quality_safety_page_commitments_order_idx" ON "quality_safety_page_commitments" USING btree ("_order");
  CREATE INDEX "quality_safety_page_commitments_parent_id_idx" ON "quality_safety_page_commitments" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "quality_safety_page_commitments_locales_locale_parent_id_uni" ON "quality_safety_page_commitments_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "quality_safety_page_hero_image_idx" ON "quality_safety_page" USING btree ("hero_image_id");
  CREATE INDEX "quality_safety_page_seo_seo_og_image_idx" ON "quality_safety_page" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "quality_safety_page_locales_locale_parent_id_unique" ON "quality_safety_page_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_page_values" CASCADE;
  DROP TABLE "about_page_values_locales" CASCADE;
  DROP TABLE "about_page_why" CASCADE;
  DROP TABLE "about_page_why_locales" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP TABLE "quality_safety_page_commitments" CASCADE;
  DROP TABLE "quality_safety_page_commitments_locales" CASCADE;
  DROP TABLE "quality_safety_page" CASCADE;
  DROP TABLE "quality_safety_page_locales" CASCADE;`)
}
