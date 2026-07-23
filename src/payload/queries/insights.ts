import { getPayloadClient } from "../lib/getClient";
import { resolveMediaUrl } from "./media";
import type { Bilingual } from "@/data/process";

export type InsightCategory = "maintenance" | "facility-management" | "quality-safety" | "buyers-guide";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- lexical editor state shape is editor-defined
type LexicalState = any;

export type InsightListItem = {
  slug: string;
  title: Bilingual;
  excerpt: Bilingual;
  category?: InsightCategory;
  cover?: string;
  readingTimeMinutes?: number;
  publishedAt?: string;
};

export type InsightDetail = InsightListItem & {
  body: { ar: LexicalState; en: LexicalState };
  tags: string[];
};

type RawInsightDoc = {
  slug: string;
  title: Bilingual;
  excerpt: Bilingual;
  category?: InsightCategory | null;
  cover?: { url?: string | null } | number | null;
  readingTimeMinutes?: number | null;
  publishedAt?: string | null;
  tags?: string[] | null;
  body?: { ar?: LexicalState; en?: LexicalState } | null;
};

function coverUrl(cover: RawInsightDoc["cover"]): string | undefined {
  if (cover && typeof cover === "object" && cover.url) {
    return resolveMediaUrl(cover.url) ?? undefined;
  }
  return undefined;
}

function mapListItem(doc: RawInsightDoc): InsightListItem {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    category: doc.category ?? undefined,
    cover: coverUrl(doc.cover),
    readingTimeMinutes: doc.readingTimeMinutes ?? undefined,
    publishedAt: doc.publishedAt ?? undefined,
  };
}

/** Published articles, newest first. Drafts never appear on the public site. */
export async function getPublishedInsights(): Promise<InsightListItem[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "insights",
    locale: "all",
    depth: 1,
    limit: 100,
    sort: "-publishedAt",
    where: { _status: { equals: "published" } },
  });
  return result.docs.map((doc) => mapListItem(doc as unknown as RawInsightDoc));
}

export async function getInsightBySlug(slug: string): Promise<InsightDetail | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "insights",
    locale: "all",
    depth: 1,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
  });
  const raw = result.docs[0];
  if (!raw) return null;
  const doc = raw as unknown as RawInsightDoc;
  return {
    ...mapListItem(doc),
    tags: (doc.tags ?? []).filter(Boolean),
    body: { ar: doc.body?.ar, en: doc.body?.en },
  };
}
