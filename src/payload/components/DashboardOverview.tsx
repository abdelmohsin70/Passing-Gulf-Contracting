import React from "react";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import type { ServerProps } from "payload";
import type { Role } from "../access";

const OPEN_LEAD_STATUSES = ["new", "contacted", "qualified", "site-visit", "scheduled", "proposal-sent"];

/**
 * The custom dashboard is a server component that renders its own copy (not
 * driven by field/label config), so it must localise its strings by hand to
 * follow the admin UI language. `i18n.language` is the code Payload resolved
 * for the current request ("ar" or "en"); everything user-facing here reads
 * from this table instead of hardcoded Arabic.
 */
type Lang = "ar" | "en";

function dict(lang: Lang) {
  const ar = {
    brand: "اجتياز الخليج للمقاولات",
    greeting: (name?: string) => (name ? `أهلًا ${name} 👋` : "أهلًا بك في لوحة التحكم"),
    intro: "من هنا تدير محتوى الموقع بالعربية والإنجليزية، وتتابع طلبات العملاء لحظة وصولها.",
    quickLook: "نظرة سريعة",
    leadsToday: "طلبات اليوم",
    leadsWeek: "طلبات هذا الأسبوع",
    leadsMonth: "طلبات هذا الشهر",
    newLeads: "طلبات جديدة غير معالجة",
    contentQueue: "محتوى قيد المراجعة",
    draftSolutions: (n: number) => `${n} حل بحالة مسودة`,
    draftProjects: (n: number) => `${n} مشروع/دراسة حالة بحالة مسودة`,
    certsExpiring: "شهادات تنتهي خلال 90 يومًا",
    followUps: "متابعات مستحقة اليوم أو متأخرة",
    byService: "حسب الخدمة",
    bySector: "حسب القطاع",
    byCity: "حسب المدينة",
    bySource: "حسب المصدر",
    unspecified: "غير محدد",
    direct: "مباشر",
    noData: "لا توجد بيانات",
    recentLeads: "آخر الطلبات",
    colRef: "المرجع",
    colName: "الاسم",
    colType: "النوع",
    colStatus: "الحالة",
    integrations: "حالة الربط بالأنظمة الخارجية",
    funnel: "الزيارات وقمع التحويل (آخر 7 أيام)",
    noAnalytics: "لا يوجد مزود تحليلات مربوط بعد — لا تُعرض أرقام افتراضية. اربط GA4 أو PostHog من إعدادات التحليلات لتفعيل هذا القسم.",
    pageViews: "مشاهدات الصفحات",
    quoteStarts: "بدايات طلب عرض",
    quoteSubmits: "طلبات مكتملة",
    intWebhook: "إشعارات الطلبات (Webhook)",
    intMedia: "تخزين الوسائط",
    intEmail: "البريد الإلكتروني",
    intAnalytics: "التحليلات",
    enabled: "مفعّل",
    webhookOff: "غير مربوط — الطلبات تُسجَّل في قاعدة البيانات فقط وتُطبع في سجل الخادم",
    mediaCloud: "مربوط بتخزين سحابي",
    mediaLocal: "تخزين محلي (بيئة تطوير فقط، غير مناسب للإنتاج)",
    emailOff: "غير مربوط — الرسائل تُطبع في سجل الخادم فقط",
    notConnected: "غير مربوط",
    ga4: "مربوط بـ Google Analytics 4",
    posthog: "مربوط بـ PostHog",
  };
  if (lang === "ar") return ar;
  const en: typeof ar = {
    brand: "Ijtiyaz Al Khaleej Contracting",
    greeting: (name?: string) => (name ? `Welcome, ${name} 👋` : "Welcome to the dashboard"),
    intro: "Manage the site's Arabic and English content here, and track client leads the moment they arrive.",
    quickLook: "Quick look",
    leadsToday: "Leads today",
    leadsWeek: "Leads this week",
    leadsMonth: "Leads this month",
    newLeads: "New unprocessed leads",
    contentQueue: "Content under review",
    draftSolutions: (n: number) => `${n} solution${n === 1 ? "" : "s"} in draft`,
    draftProjects: (n: number) => `${n} project/case stud${n === 1 ? "y" : "ies"} in draft`,
    certsExpiring: "Certifications expiring within 90 days",
    followUps: "Follow-ups due today or overdue",
    byService: "By service",
    bySector: "By sector",
    byCity: "By city",
    bySource: "By source",
    unspecified: "Unspecified",
    direct: "Direct",
    noData: "No data",
    recentLeads: "Latest leads",
    colRef: "Ref.",
    colName: "Name",
    colType: "Type",
    colStatus: "Status",
    integrations: "External systems status",
    funnel: "Traffic & conversion funnel (last 7 days)",
    noAnalytics: "No analytics provider connected yet — no placeholder numbers are shown. Connect GA4 or PostHog from Analytics settings to enable this section.",
    pageViews: "Page views",
    quoteStarts: "Quote starts",
    quoteSubmits: "Completed quotes",
    intWebhook: "Lead notifications (Webhook)",
    intMedia: "Media storage",
    intEmail: "Email",
    intAnalytics: "Analytics",
    enabled: "Enabled",
    webhookOff: "Not connected — leads are only saved to the database and printed to the server log",
    mediaCloud: "Connected to cloud storage",
    mediaLocal: "Local storage (development only, not suitable for production)",
    emailOff: "Not connected — emails are only printed to the server log",
    notConnected: "Not connected",
    ga4: "Connected to Google Analytics 4",
    posthog: "Connected to PostHog",
  };
  return en;
}

function startOf(period: "day" | "week" | "month"): Date {
  const now = new Date();
  if (period === "day") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "week") {
    const day = now.getDay();
    const diff = now.getDate() - day;
    return new Date(now.getFullYear(), now.getMonth(), diff);
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function endOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
}

function certExpiryCutoff(): Date {
  return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
}

function hasAnyRole(roles: Role[] | undefined | null, allowed: Role[]): boolean {
  if (!roles) return false;
  return roles.some((role) => allowed.includes(role));
}

function topCounts(values: Array<string | null | undefined>, fallbackLabel: string, limit = 5): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const raw of values) {
    const key = raw && raw.trim() ? raw.trim() : fallbackLabel;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

type IntegrationStatus = { label: string; configured: boolean; note: string };

async function getIntegrationHealth(
  payload: Awaited<ReturnType<typeof getPayload>>,
  t: ReturnType<typeof dict>
): Promise<IntegrationStatus[]> {
  const analyticsSettings = await payload
    .findGlobal({ slug: "analytics-settings" })
    .catch(() => null);
  const provider = (analyticsSettings as { provider?: string } | null)?.provider ?? "none";

  return [
    {
      label: t.intWebhook,
      configured: Boolean(process.env.NOTIFY_WEBHOOK_URL),
      note: process.env.NOTIFY_WEBHOOK_URL ? t.enabled : t.webhookOff,
    },
    {
      label: t.intMedia,
      configured: Boolean(process.env.S3_BUCKET || process.env.S3_ENDPOINT),
      note: process.env.S3_BUCKET || process.env.S3_ENDPOINT ? t.mediaCloud : t.mediaLocal,
    },
    {
      label: t.intEmail,
      configured: Boolean(process.env.SMTP_HOST || process.env.RESEND_API_KEY),
      note: process.env.SMTP_HOST || process.env.RESEND_API_KEY ? t.enabled : t.emailOff,
    },
    {
      label: t.intAnalytics,
      configured: provider !== "none",
      note: provider === "none" ? t.notConnected : provider === "ga4" ? t.ga4 : t.posthog,
    },
  ];
}

export async function DashboardOverview({ i18n }: { i18n?: ServerProps["i18n"] }) {
  const payload = await getPayload({ config });
  const headers = await getHeaders();
  const { user } = await payload.auth({ headers });
  const roles = (user?.roles as Role[] | undefined) ?? [];
  const lang: Lang = i18n?.language === "en" ? "en" : "ar";
  const t = dict(lang);
  const dateLocale = lang === "en" ? "en-GB" : "ar";

  const canSeeLeads = hasAnyRole(roles, ["super-admin", "sales"]);
  const canSeeContentQueue = hasAnyRole(roles, ["super-admin", "content-manager"]);
  const canSeeIntegrations = hasAnyRole(roles, ["super-admin"]);

  const [
    leadsToday,
    leadsWeek,
    leadsMonth,
    newLeads,
    recentLeads,
    breakdownLeads,
    followUpsDue,
    pendingSolutions,
    pendingProjects,
    expiringCerts,
    analyticsDaily,
    integrations,
  ] = await Promise.all([
    canSeeLeads ? countSince(payload, "leads", startOf("day")) : 0,
    canSeeLeads ? countSince(payload, "leads", startOf("week")) : 0,
    canSeeLeads ? countSince(payload, "leads", startOf("month")) : 0,
    canSeeLeads
      ? payload.count({ collection: "leads", where: { status: { equals: "new" } } }).then((r) => r.totalDocs)
      : 0,
    canSeeLeads
      ? payload.find({ collection: "leads", limit: 5, sort: "-createdAt", depth: 0 }).then((r) => r.docs)
      : [],
    // Bounded to the most recent 200 leads for breakdown counts — sufficient
    // for a sales team's working set; a true aggregation query would be
    // needed if lead volume grows into the tens of thousands.
    canSeeLeads
      ? payload
          .find({ collection: "leads", limit: 200, sort: "-createdAt", depth: 0 })
          .then((r) => r.docs)
      : [],
    canSeeLeads
      ? payload
          .find({
            collection: "leads",
            limit: 10,
            sort: "followUpAt",
            depth: 0,
            where: {
              and: [
                { followUpAt: { less_than_equal: endOfToday().toISOString() } },
                { followUpAt: { exists: true } },
                { status: { in: OPEN_LEAD_STATUSES } },
              ],
            },
          })
          .then((r) => r.docs)
      : [],
    canSeeContentQueue
      ? payload.count({ collection: "solutions", where: { _status: { equals: "draft" } } }).then((r) => r.totalDocs)
      : 0,
    canSeeContentQueue
      ? payload.count({ collection: "projects", where: { _status: { equals: "draft" } } }).then((r) => r.totalDocs)
      : 0,
    payload
      .find({
        collection: "certifications",
        where: { expiresAt: { less_than: certExpiryCutoff().toISOString() } },
        limit: 5,
      })
      .then((r) => r.docs)
      .catch(() => []),
    canSeeIntegrations
      ? payload
          .find({ collection: "analytics-daily", limit: 7, sort: "-date", depth: 0 })
          .then((r) => r.docs)
          .catch(() => [])
      : [],
    canSeeIntegrations ? getIntegrationHealth(payload, t) : [],
  ]);

  const byService = canSeeLeads
    ? topCounts(
        breakdownLeads.map((lead) => String(lead.serviceSlug ?? "")),
        t.unspecified
      )
    : [];
  const bySector = canSeeLeads
    ? topCounts(
        breakdownLeads.map((lead) => String(lead.sectorSlug ?? "")),
        t.unspecified
      )
    : [];
  const byCity = canSeeLeads
    ? topCounts(
        breakdownLeads.map((lead) => String(lead.city ?? "")),
        t.unspecified
      )
    : [];
  const bySource = canSeeLeads
    ? topCounts(
        breakdownLeads.map((lead) => {
          const utm = lead.utm as { source?: string } | null | undefined;
          return utm?.source ?? "";
        }),
        t.direct
      )
    : [];

  const analyticsTotals = analyticsDaily.reduce(
    (acc, day) => {
      acc.pageViews += Number(day.pageViews ?? 0);
      acc.quoteStarts += Number(day.quoteStarts ?? 0);
      acc.quoteSubmits += Number(day.quoteSubmits ?? 0);
      return acc;
    },
    { pageViews: 0, quoteStarts: 0, quoteSubmits: 0 }
  );

  return (
    <div className="ijk-overview" style={{ padding: "16px 0 8px" }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 18,
          background: "linear-gradient(100deg, #0a1c2e 0%, #102a43 55%, rgba(16, 42, 67, 0.85) 100%)",
          color: "#ffffff",
          padding: "28px 32px",
          marginBottom: 24,
          boxShadow: "0 2px 4px rgba(16, 42, 67, 0.08), 0 16px 40px rgba(16, 42, 67, 0.12)",
        }}
      >
        {/* Same hero photo family the public site uses; decorative only. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/safety-helmets.jpg"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.18,
          }}
        />
        <div style={{ position: "relative" }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#f36b2b", letterSpacing: "0.02em" }}>
            {t.brand}
          </p>
          <h2 style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 700 }}>
            {t.greeting(user?.name ? String(user.name) : undefined)}
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "rgba(255, 255, 255, 0.75)", maxWidth: 560 }}>
            {t.intro}
          </p>
        </div>
      </div>

      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "var(--theme-text)",
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: "2px solid #f36b2b",
          display: "inline-block",
        }}
      >
        {t.quickLook}
      </h2>

      {canSeeLeads ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
          <KpiCard label={t.leadsToday} value={leadsToday} />
          <KpiCard label={t.leadsWeek} value={leadsWeek} />
          <KpiCard label={t.leadsMonth} value={leadsMonth} />
          <KpiCard label={t.newLeads} value={newLeads} accent />
        </div>
      ) : null}

      {canSeeContentQueue && (pendingSolutions > 0 || pendingProjects > 0) ? (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>{t.contentQueue}</SectionTitle>
          <ul style={{ margin: 0, paddingInlineStart: 18 }}>
            {pendingSolutions > 0 ? <li>{t.draftSolutions(pendingSolutions)}</li> : null}
            {pendingProjects > 0 ? <li>{t.draftProjects(pendingProjects)}</li> : null}
          </ul>
        </div>
      ) : null}

      {expiringCerts.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>{t.certsExpiring}</SectionTitle>
          <ul style={{ margin: 0, paddingInlineStart: 18 }}>
            {expiringCerts.map((cert) => (
              <li key={String(cert.id)}>
                {String(cert.code)} — {cert.expiresAt ? new Date(String(cert.expiresAt)).toLocaleDateString(dateLocale) : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {canSeeLeads && followUpsDue.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>{t.followUps}</SectionTitle>
          <ul style={{ margin: 0, paddingInlineStart: 18 }}>
            {followUpsDue.map((lead) => (
              <li key={String(lead.id)}>
                <a href={`/admin/collections/leads/${lead.id}`}>{String(lead.name ?? lead.referenceNumber)}</a> —{" "}
                {lead.followUpAt ? new Date(String(lead.followUpAt)).toLocaleDateString(dateLocale) : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {canSeeLeads && breakdownLeads.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
          <BreakdownCard title={t.byService} entries={byService} emptyLabel={t.noData} />
          <BreakdownCard title={t.bySector} entries={bySector} emptyLabel={t.noData} />
          <BreakdownCard title={t.byCity} entries={byCity} emptyLabel={t.noData} />
          <BreakdownCard title={t.bySource} entries={bySource} emptyLabel={t.noData} />
        </div>
      ) : null}

      {canSeeLeads && recentLeads.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>{t.recentLeads}</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "start", borderBottom: "2px solid var(--theme-elevation-200)" }}>
                <th style={{ padding: "6px 8px", color: "var(--theme-text)" }}>{t.colRef}</th>
                <th style={{ padding: "6px 8px", color: "var(--theme-text)" }}>{t.colName}</th>
                <th style={{ padding: "6px 8px", color: "var(--theme-text)" }}>{t.colType}</th>
                <th style={{ padding: "6px 8px", color: "var(--theme-text)" }}>{t.colStatus}</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={String(lead.id)} style={{ borderBottom: "1px solid var(--theme-elevation-100)" }}>
                  <td style={{ padding: "6px 8px" }}>
                    <a href={`/admin/collections/leads/${lead.id}`} style={{ color: "#f36b2b", fontWeight: 600 }}>
                      {String(lead.referenceNumber)}
                    </a>
                  </td>
                  <td style={{ padding: "6px 8px" }}>{String(lead.name ?? "")}</td>
                  <td style={{ padding: "6px 8px" }}>{String(lead.type ?? "")}</td>
                  <td style={{ padding: "6px 8px" }}>{String(lead.status ?? "")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {canSeeIntegrations ? (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>{t.integrations}</SectionTitle>
          <ul style={{ margin: 0, paddingInlineStart: 18 }}>
            {integrations.map((item) => (
              <li key={item.label}>
                <span style={{ color: item.configured ? "#1f7a5a" : "#d4551a" }}>
                  {item.configured ? "●" : "○"}
                </span>{" "}
                <strong style={{ color: "var(--theme-text)" }}>{item.label}:</strong>{" "}
                <span style={{ color: "var(--theme-elevation-500)" }}>{item.note}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {canSeeIntegrations ? (
        <div>
          <SectionTitle>{t.funnel}</SectionTitle>
          {analyticsDaily.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--theme-elevation-500)", margin: 0 }}>
              {t.noAnalytics}
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              <KpiCard label={t.pageViews} value={analyticsTotals.pageViews} />
              <KpiCard label={t.quoteStarts} value={analyticsTotals.quoteStarts} />
              <KpiCard label={t.quoteSubmits} value={analyticsTotals.quoteSubmits} />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

// These read from Payload's theme variables (which flip between light and
// dark) rather than hardcoded hex, so the custom dashboard adapts to the
// editor's chosen admin theme. The orange accent is brand and stays fixed.
function BreakdownCard({ title, entries, emptyLabel }: { title: string; entries: Array<[string, number]>; emptyLabel: string }) {
  return (
    <div
      style={{
        border: "1px solid var(--theme-elevation-100)",
        borderRadius: 12,
        padding: "12px 16px",
        background: "var(--theme-elevation-0)",
      }}
    >
      <h4 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 8px", color: "var(--theme-text)" }}>{title}</h4>
      {entries.length === 0 ? (
        <p style={{ fontSize: 12, color: "var(--theme-elevation-500)", margin: 0 }}>{emptyLabel}</p>
      ) : (
        <ul style={{ margin: 0, paddingInlineStart: 16, fontSize: 12, color: "var(--theme-elevation-500)" }}>
          {entries.map(([label, count]) => (
            <li key={label}>
              {label} — {count}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function KpiCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      style={{
        border: accent ? "1px solid rgba(243, 107, 43, 0.35)" : "1px solid var(--theme-elevation-100)",
        borderRadius: 12,
        padding: "14px 16px",
        background: accent ? "rgba(243, 107, 43, 0.1)" : "var(--theme-elevation-0)",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 700, color: accent ? "#f36b2b" : "var(--theme-text)" }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--theme-elevation-500)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px", color: "var(--theme-text)" }}>{children}</h3>;
}

async function countSince(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: "leads",
  since: Date
): Promise<number> {
  const result = await payload.count({
    collection,
    where: { createdAt: { greater_than_equal: since.toISOString() } },
  });
  return result.totalDocs;
}
