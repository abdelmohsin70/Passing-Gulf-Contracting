/**
 * Idempotent seed script. Safe to re-run: every section checks whether its
 * content already exists before creating anything again.
 *
 * Run with: npm run seed
 *
 * What this does NOT do, on purpose: invent client names, performance
 * numbers, certifications, testimonials, or team photos. Anything that
 * would require real evidence is either left empty or created as an
 * explicitly-labeled draft/unverified placeholder — see README/
 * CONTENT-VERIFICATION.md.
 */
import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import { getPayload } from "payload";

// `next dev`/`next build` load .env.local automatically; this standalone
// script needs to do it itself before importing the config that reads
// DATABASE_URI/PAYLOAD_SECRET from process.env.
if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

const { default: config } = await import("@payload-config");
import { solutions as staticSolutions } from "../../data/solutions";
import { sectors as staticSectors } from "../../data/sectors";

type Payload = Awaited<ReturnType<typeof getPayload>>;

/**
 * Array fields (e.g. `scope: [{ item }]`) get their row IDs assigned on
 * create. A locale-scoped `update` with a fresh array (no `id`s) would
 * otherwise be treated as "replace all rows", creating brand-new rows that
 * only carry the second locale's values and leaving the first locale's
 * rows orphaned. Re-attach the original row IDs by position so the update
 * fills in the second locale on the *same* rows instead.
 */
function withRowIds<T>(createdArray: unknown, newArray: T[]): T[] {
  if (!Array.isArray(createdArray)) return newArray;
  return newArray.map((row, index) => {
    const id = (createdArray[index] as { id?: string } | undefined)?.id;
    return id ? { ...row, id } : row;
  });
}

async function createBilingual<T extends Record<string, unknown>>(
  payload: Payload,
  collection: Parameters<Payload["create"]>[0]["collection"],
  arData: T,
  enData: Partial<T>,
  extraData: Record<string, unknown> = {},
  arrayFields: string[] = []
) {
  const doc = await payload.create({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic helper spans multiple collection shapes
    collection: collection as any,
    locale: "ar",
    overrideAccess: true,
    data: { ...arData, ...extraData },
  });

  const enDataWithIds: Record<string, unknown> = { ...enData };
  for (const field of arrayFields) {
    if (Array.isArray((enData as Record<string, unknown>)[field])) {
      enDataWithIds[field] = withRowIds(
        (doc as unknown as Record<string, unknown>)[field],
        (enData as Record<string, unknown>)[field] as unknown[]
      );
    }
  }

  await payload.update({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic helper spans multiple collection shapes
    collection: collection as any,
    id: doc.id,
    locale: "en",
    overrideAccess: true,
    data: enDataWithIds,
  });
  return doc;
}

async function seedAdminUser(payload: Payload) {
  const existing = await payload.count({ collection: "users", overrideAccess: true });
  if (existing.totalDocs > 0) {
    console.log("[seed] users already exist — skipping admin creation");
    return;
  }
  const email = process.env.PAYLOAD_ADMIN_EMAIL;
  const password = process.env.PAYLOAD_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("[seed] PAYLOAD_ADMIN_EMAIL/PAYLOAD_ADMIN_PASSWORD not set — skipping admin creation");
    return;
  }
  await payload.create({
    collection: "users",
    overrideAccess: true,
    data: { email, password, name: "Super Admin", roles: ["super-admin"], active: true },
  });
  console.log(`[seed] created super-admin user ${email}`);
}

async function seedSectors(payload: Payload): Promise<Map<string, number>> {
  const idBySlug = new Map<string, number>();
  for (const sector of staticSectors) {
    const existing = await payload.find({
      collection: "sectors",
      where: { slug: { equals: sector.slug } },
      overrideAccess: true,
      limit: 1,
    });
    if (existing.docs[0]) {
      idBySlug.set(sector.slug, existing.docs[0].id as number);
      continue;
    }
    const doc = await createBilingual(
      payload,
      "sectors",
      { title: sector.title.ar, summary: sector.description.ar },
      { title: sector.title.en, summary: sector.description.en },
      { slug: sector.slug, icon: sector.icon, _status: "published" }
    );
    idBySlug.set(sector.slug, doc.id as number);
    console.log(`[seed] created sector ${sector.slug}`);
  }
  return idBySlug;
}

async function seedSolutions(payload: Payload, sectorIdBySlug: Map<string, number>) {
  for (const solution of staticSolutions) {
    const existing = await payload.find({
      collection: "solutions",
      where: { slug: { equals: solution.slug } },
      overrideAccess: true,
      limit: 1,
    });
    if (existing.docs[0]) continue;

    const sectorIds = solution.sectors.map((slug) => sectorIdBySlug.get(slug)).filter((id): id is number => Boolean(id));

    const doc = await createBilingual(
      payload,
      "solutions",
      {
        title: solution.title.ar,
        summary: solution.summary.ar,
        heroOutcome: solution.heroOutcome.ar,
        problem: solution.problem.ar,
        methodology: solution.methodology.ar,
        quality: solution.quality.ar,
        scope: solution.scope.map((item) => ({ item: item.ar })),
        faqs: solution.faqs.map((faq) => ({ question: faq.question.ar, answer: faq.answer.ar })),
      },
      {
        title: solution.title.en,
        summary: solution.summary.en,
        heroOutcome: solution.heroOutcome.en,
        problem: solution.problem.en,
        methodology: solution.methodology.en,
        quality: solution.quality.en,
        scope: solution.scope.map((item) => ({ item: item.en })),
        faqs: solution.faqs.map((faq) => ({ question: faq.question.en, answer: faq.answer.en })),
      },
      {
        slug: solution.slug,
        icon: solution.icon,
        featured: solution.featured,
        sectors: sectorIds,
        _status: "published",
      },
      ["scope", "faqs"]
    );
    console.log(`[seed] created solution ${solution.slug} (${doc.id})`);
  }
}

const IMAGES_DIR = path.resolve(process.cwd(), "public/images");

// Real photography extracted from the client's own brochure PDF (not stock
// photos) — see README "Imagery". Mapped here so the CMS Media library and
// Solutions.heroImage/gallery become the single source of truth instead of
// the frontend hardcoding /public/images paths directly.
const MEDIA_ALT: Record<string, { ar: string; en: string }> = {
  "facility-management-banner.jpg": { ar: "فني صيانة يعمل في منشأة تجارية", en: "Maintenance technician working at a commercial facility" },
  "hvac-maintenance.jpg": { ar: "صيانة نظام تكييف", en: "HVAC system maintenance" },
  "plumbing-repair.jpg": { ar: "إصلاح أعمال سباكة", en: "Plumbing repair work" },
  "technician-toolbox.jpg": { ar: "صندوق عدة فني الصيانة", en: "Maintenance technician's toolbox" },
  "wrenches-hand.jpg": { ar: "أدوات صيانة يدوية", en: "Hand maintenance tools" },
  "cleaning-soft-services-banner.jpg": { ar: "فريق نظافة يعمل في منشأة", en: "Cleaning team at work in a facility" },
  "cleaning-supplies.jpg": { ar: "مستلزمات ومعدات نظافة", en: "Cleaning supplies and equipment" },
  "renovation-projects-banner.jpg": { ar: "أعمال ترميم وتجديد مبنى", en: "Building renovation work" },
  "landscape-agriculture-hero.jpg": { ar: "تنسيق وصيانة مساحات خضراء", en: "Landscaping and green space maintenance" },
  "airport-services-hero.jpg": { ar: "خدمات أرضية في مطار", en: "Airport ground services" },
  "pest-control-hero.jpg": { ar: "أعمال مكافحة حشرية", en: "Pest control work" },
  "arabic-hospitality.jpg": { ar: "خدمات ضيافة", en: "Hospitality services" },
  "workforce-driver.jpg": { ar: "سائق ضمن فريق التشغيل", en: "Driver as part of the operations workforce" },
  "home-care-pool.jpg": { ar: "عناية منزلية — صيانة مسبح", en: "Home care — pool maintenance" },
};

const SOLUTION_IMAGES: Record<string, { hero: string; gallery?: string[] }> = {
  "facility-management": {
    hero: "facility-management-banner.jpg",
    gallery: ["hvac-maintenance.jpg", "plumbing-repair.jpg", "technician-toolbox.jpg", "wrenches-hand.jpg"],
  },
  "cleaning-soft-services": { hero: "cleaning-soft-services-banner.jpg", gallery: ["cleaning-supplies.jpg"] },
  "renovation-projects": { hero: "renovation-projects-banner.jpg" },
  "landscape-agriculture": { hero: "landscape-agriculture-hero.jpg" },
  "airport-services": { hero: "airport-services-hero.jpg" },
  "pest-control": { hero: "pest-control-hero.jpg" },
  "hospitality-workforce": { hero: "arabic-hospitality.jpg", gallery: ["arabic-hospitality.jpg", "workforce-driver.jpg"] },
  "home-care": { hero: "home-care-pool.jpg", gallery: ["home-care-pool.jpg"] },
};

async function uploadMediaFile(payload: Payload, filename: string): Promise<number> {
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    overrideAccess: true,
    limit: 1,
  });
  if (existing.docs[0]) return existing.docs[0].id as number;

  const alt = MEDIA_ALT[filename] ?? { ar: filename, en: filename };
  const filePath = path.join(IMAGES_DIR, filename);
  const data = readFileSync(filePath);
  const stat = statSync(filePath);

  const doc = await payload.create({
    collection: "media",
    overrideAccess: true,
    data: { altAr: alt.ar, altEn: alt.en, category: "sites", usageApproved: true },
    file: { data, mimetype: "image/jpeg", name: filename, size: stat.size },
  });
  console.log(`[seed] uploaded media ${filename}`);
  return doc.id as number;
}

async function seedMedia(payload: Payload): Promise<Map<string, number>> {
  const filenames = new Set<string>();
  for (const entry of Object.values(SOLUTION_IMAGES)) {
    filenames.add(entry.hero);
    for (const g of entry.gallery ?? []) filenames.add(g);
  }
  const idByFilename = new Map<string, number>();
  for (const filename of filenames) {
    idByFilename.set(filename, await uploadMediaFile(payload, filename));
  }
  return idByFilename;
}

async function attachSolutionMedia(payload: Payload, mediaIdByFilename: Map<string, number>) {
  for (const [slug, images] of Object.entries(SOLUTION_IMAGES)) {
    const existing = await payload.find({
      collection: "solutions",
      where: { slug: { equals: slug } },
      overrideAccess: true,
      limit: 1,
    });
    const doc = existing.docs[0];
    if (!doc || doc.heroImage) continue; // already attached (or solution not seeded yet) — don't overwrite editor changes

    const heroImageId = mediaIdByFilename.get(images.hero);
    const galleryIds = (images.gallery ?? []).map((f) => mediaIdByFilename.get(f)).filter((id): id is number => Boolean(id));

    await payload.update({
      collection: "solutions",
      id: doc.id,
      overrideAccess: true,
      data: { heroImage: heroImageId, gallery: galleryIds },
    });
    console.log(`[seed] attached media to solution ${slug}`);
  }
}

async function seedCertifications(payload: Payload) {
  const items = [
    { code: "ISO 9001:2015", labelAr: "إدارة الجودة", labelEn: "Quality Management" },
    { code: "ISO 14001:2015", labelAr: "الإدارة البيئية", labelEn: "Environmental Management" },
    { code: "ISO 45001:2018", labelAr: "الصحة والسلامة المهنية", labelEn: "Occupational Health & Safety" },
  ];
  for (const item of items) {
    const existing = await payload.find({
      collection: "certifications",
      where: { code: { equals: item.code } },
      overrideAccess: true,
      limit: 1,
    });
    if (existing.docs[0]) continue;
    await payload.create({
      collection: "certifications",
      overrideAccess: true,
      data: { ...item, publicVisibility: false },
    });
    console.log(`[seed] created certification placeholder ${item.code}`);
  }
}

const DRAFT_PROJECTS: Array<{ slug: string; titleAr: string; titleEn: string; sectorSlug: string; solutionSlug: string }> = [
  {
    slug: "commercial-facility-om-template",
    titleAr: "تشغيل وصيانة منشأة تجارية",
    titleEn: "Commercial Facility Operation & Maintenance",
    sectorSlug: "commercial-admin",
    solutionSlug: "facility-management",
  },
  {
    slug: "healthcare-specialized-cleaning-template",
    titleAr: "برنامج نظافة متخصصة لمنشأة صحية",
    titleEn: "Specialized Cleaning Program for a Healthcare Facility",
    sectorSlug: "healthcare",
    solutionSlug: "cleaning-soft-services",
  },
  {
    slug: "office-building-renovation-template",
    titleAr: "ترميم وتجديد مبنى إداري",
    titleEn: "Office Building Renovation",
    sectorSlug: "commercial-admin",
    solutionSlug: "renovation-projects",
  },
  {
    slug: "residential-landscape-template",
    titleAr: "تنسيق وصيانة مساحات خضراء لمجمع سكني",
    titleEn: "Landscaping & Maintenance for a Residential Compound",
    sectorSlug: "residential-hospitality",
    solutionSlug: "landscape-agriculture",
  },
];

async function seedDraftProjects(payload: Payload, sectorIdBySlug: Map<string, number>) {
  for (const item of DRAFT_PROJECTS) {
    const existing = await payload.find({
      collection: "projects",
      where: { slug: { equals: item.slug } },
      overrideAccess: true,
      limit: 1,
    });
    if (existing.docs[0]) continue;

    const solutionResult = await payload.find({
      collection: "solutions",
      where: { slug: { equals: item.solutionSlug } },
      overrideAccess: true,
      limit: 1,
    });
    const solutionId = solutionResult.docs[0]?.id as number | undefined;

    await createBilingual(
      payload,
      "projects",
      {
        title: item.titleAr,
        clientDisplayName: "[اسم العميل بعد الاعتماد]",
        city: "[المدينة]",
        durationLabel: "[مدة العقد بعد التوثيق]",
        challenge: "[وصف التحدي الذي واجهه العميل قبل التعاقد — يُستكمل بعد المراجعة الداخلية]",
        scope: "[نطاق العمل التفصيلي — يُستكمل بعد المراجعة الداخلية]",
        solutionApproach: "[المنهجية المتبعة لمعالجة التحدي — يُستكمل بعد المراجعة الداخلية]",
      },
      {
        title: item.titleEn,
        clientDisplayName: "[Client name pending approval]",
        city: "[City]",
        durationLabel: "[Contract duration pending verification]",
        challenge: "[The challenge the client faced before engaging us — to complete after internal review]",
        scope: "[Detailed scope of work — to complete after internal review]",
        solutionApproach: "[The methodology applied — to complete after internal review]",
      },
      {
        slug: item.slug,
        sector: sectorIdBySlug.get(item.sectorSlug),
        relatedSolutions: solutionId ? [solutionId] : [],
        verificationStatus: "unverified",
        workflowStatus: "draft",
        confidentialityMode: "confidential",
        _status: "draft",
      }
    );
    console.log(`[seed] created draft case-study template ${item.slug}`);
  }
}

const DRAFT_INSIGHTS: Array<{ slug: string; titleAr: string; titleEn: string }> = [
  {
    slug: "preventive-maintenance-reduces-downtime",
    titleAr: "كيف تقلل الصيانة الوقائية توقف المنشأة؟",
    titleEn: "How Preventive Maintenance Reduces Facility Downtime",
  },
  {
    slug: "hard-fm-vs-soft-fm",
    titleAr: "الفرق بين Hard FM وSoft FM",
    titleEn: "Hard FM vs. Soft FM: What's the Difference?",
  },
  {
    slug: "choosing-a-facility-management-contract",
    titleAr: "كيف تختار عقد إدارة مرافق مناسبًا؟",
    titleEn: "How to Choose the Right Facility Management Contract",
  },
];

async function seedDraftInsights(payload: Payload) {
  for (const item of DRAFT_INSIGHTS) {
    const existing = await payload.find({
      collection: "insights",
      where: { slug: { equals: item.slug } },
      overrideAccess: true,
      limit: 1,
    });
    if (existing.docs[0]) continue;

    await createBilingual(
      payload,
      "insights",
      {
        title: item.titleAr,
        excerpt: "مسودة — محتوى قيد الإعداد من فريق التسويق قبل المراجعة والنشر.",
        body: {
          root: {
            type: "root",
            children: [{ type: "paragraph", children: [{ type: "text", text: "مسودة أولية." }] }],
          },
        },
      },
      {
        title: item.titleEn,
        excerpt: "Draft — content is being prepared by the marketing team ahead of review and publishing.",
        body: {
          root: {
            type: "root",
            children: [{ type: "paragraph", children: [{ type: "text", text: "Initial draft." }] }],
          },
        },
      },
      { slug: item.slug, _status: "draft" }
    );
    console.log(`[seed] created draft insight ${item.slug}`);
  }
}

async function seedGlobals(payload: Payload) {
  await payload.updateGlobal({
    slug: "site-settings",
    overrideAccess: true,
    data: {
      nameAr: "شركة اجتياز الخليج للمقاولات",
      nameEn: "Ijtiyaz Al Khaleej Contracting",
      nameEnStatus: "pending",
      foundedYear: 2015,
      foundedCityAr: "الرياض",
      foundedCityEn: "Riyadh",
    },
  });

  await payload.updateGlobal({
    slug: "contact-settings",
    overrideAccess: true,
    data: {
      emailStatus: "pending",
      phoneStatus: "pending",
      whatsappStatus: "pending",
      addressStatus: "pending",
    },
  });

  await payload.updateGlobal({
    slug: "homepage",
    overrideAccess: true,
    locale: "ar",
    data: {
      hero: {
        title: "نشغّل مرافقك. نحمي أصولك. ونحافظ على استمرارية أعمالك.",
        subtitle: "حلول متكاملة لإدارة المرافق والتشغيل والصيانة والخدمات المساندة في أنحاء المملكة العربية السعودية.",
        ctaPrimaryLabel: "اطلب معاينة وعرضًا",
        ctaSecondaryLabel: "استكشف الحلول",
      },
      showClientsSection: false,
    },
  });
  await payload.updateGlobal({
    slug: "homepage",
    overrideAccess: true,
    locale: "en",
    data: {
      hero: {
        title: "We run your facilities. We protect your assets. We keep your business moving.",
        subtitle: "Integrated facility management, operation, maintenance, and support services across Saudi Arabia.",
        ctaPrimaryLabel: "Request a Visit & Quote",
        ctaSecondaryLabel: "Explore Solutions",
      },
    },
  });

  console.log("[seed] globals updated");
}

async function run() {
  const payload = await getPayload({ config });
  console.log("[seed] starting...");

  await seedAdminUser(payload);
  const sectorIdBySlug = await seedSectors(payload);
  await seedSolutions(payload, sectorIdBySlug);
  const mediaIdByFilename = await seedMedia(payload);
  await attachSolutionMedia(payload, mediaIdByFilename);
  await seedCertifications(payload);
  await seedDraftProjects(payload, sectorIdBySlug);
  await seedDraftInsights(payload);
  await seedGlobals(payload);

  console.log("[seed] done.");
  process.exit(0);
}

run().catch((error) => {
  console.error("[seed] failed", error);
  process.exit(1);
});
