import React from "react";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Role } from "../access";

const OPEN_LEAD_STATUSES = ["new", "contacted", "qualified", "site-visit", "scheduled", "proposal-sent"];

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
  payload: Awaited<ReturnType<typeof getPayload>>
): Promise<IntegrationStatus[]> {
  const analyticsSettings = await payload
    .findGlobal({ slug: "analytics-settings" })
    .catch(() => null);
  const provider = (analyticsSettings as { provider?: string } | null)?.provider ?? "none";

  return [
    {
      label: "إشعارات الطلبات (Webhook)",
      configured: Boolean(process.env.NOTIFY_WEBHOOK_URL),
      note: process.env.NOTIFY_WEBHOOK_URL ? "مفعّل" : "غير مربوط — الطلبات تُسجَّل في قاعدة البيانات فقط وتُطبع في سجل الخادم",
    },
    {
      label: "تخزين الوسائط",
      configured: Boolean(process.env.S3_BUCKET || process.env.S3_ENDPOINT),
      note: process.env.S3_BUCKET || process.env.S3_ENDPOINT ? "مربوط بتخزين سحابي" : "تخزين محلي (بيئة تطوير فقط، غير مناسب للإنتاج)",
    },
    {
      label: "البريد الإلكتروني",
      configured: Boolean(process.env.SMTP_HOST || process.env.RESEND_API_KEY),
      note: process.env.SMTP_HOST || process.env.RESEND_API_KEY ? "مفعّل" : "غير مربوط — الرسائل تُطبع في سجل الخادم فقط",
    },
    {
      label: "التحليلات",
      configured: provider !== "none",
      note: provider === "none" ? "غير مربوط" : provider === "ga4" ? "مربوط بـ Google Analytics 4" : "مربوط بـ PostHog",
    },
  ];
}

export async function DashboardOverview() {
  const payload = await getPayload({ config });
  const headers = await getHeaders();
  const { user } = await payload.auth({ headers });
  const roles = (user?.roles as Role[] | undefined) ?? [];

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
    canSeeIntegrations ? getIntegrationHealth(payload) : [],
  ]);

  const byService = canSeeLeads
    ? topCounts(
        breakdownLeads.map((lead) => String(lead.serviceSlug ?? "")),
        "غير محدد"
      )
    : [];
  const bySector = canSeeLeads
    ? topCounts(
        breakdownLeads.map((lead) => String(lead.sectorSlug ?? "")),
        "غير محدد"
      )
    : [];
  const byCity = canSeeLeads
    ? topCounts(
        breakdownLeads.map((lead) => String(lead.city ?? "")),
        "غير محدد"
      )
    : [];
  const bySource = canSeeLeads
    ? topCounts(
        breakdownLeads.map((lead) => {
          const utm = lead.utm as { source?: string } | null | undefined;
          return utm?.source ?? "";
        }),
        "مباشر"
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
            اجتياز الخليج للمقاولات
          </p>
          <h2 style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 700 }}>
            {user?.name ? `أهلًا ${String(user.name)} 👋` : "أهلًا بك في لوحة التحكم"}
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "rgba(255, 255, 255, 0.75)", maxWidth: 560 }}>
            من هنا تدير محتوى الموقع بالعربية والإنجليزية، وتتابع طلبات العملاء لحظة وصولها.
          </p>
        </div>
      </div>

      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#102a43",
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: "2px solid #f36b2b",
          display: "inline-block",
        }}
      >
        نظرة سريعة
      </h2>

      {canSeeLeads ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
          <KpiCard label="طلبات اليوم" value={leadsToday} />
          <KpiCard label="طلبات هذا الأسبوع" value={leadsWeek} />
          <KpiCard label="طلبات هذا الشهر" value={leadsMonth} />
          <KpiCard label="طلبات جديدة غير معالجة" value={newLeads} accent />
        </div>
      ) : null}

      {canSeeContentQueue && (pendingSolutions > 0 || pendingProjects > 0) ? (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>محتوى قيد المراجعة</SectionTitle>
          <ul style={{ margin: 0, paddingInlineStart: 18 }}>
            {pendingSolutions > 0 ? <li>{pendingSolutions} حل بحالة مسودة</li> : null}
            {pendingProjects > 0 ? <li>{pendingProjects} مشروع/دراسة حالة بحالة مسودة</li> : null}
          </ul>
        </div>
      ) : null}

      {expiringCerts.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>شهادات تنتهي خلال 90 يومًا</SectionTitle>
          <ul style={{ margin: 0, paddingInlineStart: 18 }}>
            {expiringCerts.map((cert) => (
              <li key={String(cert.id)}>
                {String(cert.code)} — {cert.expiresAt ? new Date(String(cert.expiresAt)).toLocaleDateString("ar") : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {canSeeLeads && followUpsDue.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>متابعات مستحقة اليوم أو متأخرة</SectionTitle>
          <ul style={{ margin: 0, paddingInlineStart: 18 }}>
            {followUpsDue.map((lead) => (
              <li key={String(lead.id)}>
                <a href={`/admin/collections/leads/${lead.id}`}>{String(lead.name ?? lead.referenceNumber)}</a> —{" "}
                {lead.followUpAt ? new Date(String(lead.followUpAt)).toLocaleDateString("ar") : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {canSeeLeads && breakdownLeads.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
          <BreakdownCard title="حسب الخدمة" entries={byService} />
          <BreakdownCard title="حسب القطاع" entries={bySector} />
          <BreakdownCard title="حسب المدينة" entries={byCity} />
          <BreakdownCard title="حسب المصدر" entries={bySource} />
        </div>
      ) : null}

      {canSeeLeads && recentLeads.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>آخر الطلبات</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "start", borderBottom: "2px solid #102a43" }}>
                <th style={{ padding: "6px 8px", color: "#102a43" }}>المرجع</th>
                <th style={{ padding: "6px 8px", color: "#102a43" }}>الاسم</th>
                <th style={{ padding: "6px 8px", color: "#102a43" }}>النوع</th>
                <th style={{ padding: "6px 8px", color: "#102a43" }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={String(lead.id)} style={{ borderBottom: "1px solid rgba(16, 42, 67, 0.08)" }}>
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
          <SectionTitle>حالة الربط بالأنظمة الخارجية</SectionTitle>
          <ul style={{ margin: 0, paddingInlineStart: 18 }}>
            {integrations.map((item) => (
              <li key={item.label}>
                <span style={{ color: item.configured ? "#1f7a5a" : "#d4551a" }}>
                  {item.configured ? "●" : "○"}
                </span>{" "}
                <strong style={{ color: "#102a43" }}>{item.label}:</strong>{" "}
                <span style={{ color: "#52606d" }}>{item.note}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {canSeeIntegrations ? (
        <div>
          <SectionTitle>الزيارات وقمع التحويل (آخر 7 أيام)</SectionTitle>
          {analyticsDaily.length === 0 ? (
            <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
              لا يوجد مزود تحليلات مربوط بعد — لا تُعرض أرقام افتراضية. اربط GA4 أو PostHog من إعدادات التحليلات
              لتفعيل هذا القسم.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              <KpiCard label="مشاهدات الصفحات" value={analyticsTotals.pageViews} />
              <KpiCard label="بدايات طلب عرض" value={analyticsTotals.quoteStarts} />
              <KpiCard label="طلبات مكتملة" value={analyticsTotals.quoteSubmits} />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function BreakdownCard({ title, entries }: { title: string; entries: Array<[string, number]> }) {
  return (
    <div
      style={{
        border: "1px solid rgba(16, 42, 67, 0.1)",
        borderRadius: 12,
        padding: "12px 16px",
        background: "#fff",
        boxShadow: "0 1px 2px rgba(16, 42, 67, 0.06), 0 8px 24px rgba(16, 42, 67, 0.06)",
      }}
    >
      <h4 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 8px", color: "#102a43" }}>{title}</h4>
      {entries.length === 0 ? (
        <p style={{ fontSize: 12, color: "#52606d", margin: 0 }}>لا توجد بيانات</p>
      ) : (
        <ul style={{ margin: 0, paddingInlineStart: 16, fontSize: 12, color: "#52606d" }}>
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
        border: accent ? "1px solid rgba(243, 107, 43, 0.35)" : "1px solid rgba(16, 42, 67, 0.1)",
        borderRadius: 12,
        padding: "14px 16px",
        background: accent ? "#fff4ec" : "#fff",
        boxShadow: "0 1px 2px rgba(16, 42, 67, 0.06), 0 8px 24px rgba(16, 42, 67, 0.06)",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 700, color: accent ? "#d4551a" : "#102a43" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#52606d", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px", color: "#102a43" }}>{children}</h3>;
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
