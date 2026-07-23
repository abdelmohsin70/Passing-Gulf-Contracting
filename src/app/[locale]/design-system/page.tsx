import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";

// Internal reference page — never indexed. In production it is only
// reachable when ENABLE_DESIGN_SYSTEM=true, so it isn't exposed publicly
// by default while staying available for design review in previews.
export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

// Read the gate per-request (not baked at build time) so ENABLE_DESIGN_SYSTEM
// set in the environment actually takes effect.
export const dynamic = "force-dynamic";

function isGated() {
  return process.env.NODE_ENV === "production" && process.env.ENABLE_DESIGN_SYSTEM !== "true";
}

const colorTokens: Array<{ name: string; var: string; note: string }> = [
  { name: "bg", var: "--color-bg", note: "خلفية الصفحة" },
  { name: "bg-subtle", var: "--color-bg-subtle", note: "لوحات غائرة" },
  { name: "surface", var: "--color-surface", note: "بطاقات وحقول" },
  { name: "surface-2", var: "--color-surface-2", note: "أسطح متداخلة" },
  { name: "ink", var: "--color-ink", note: "نص شبه أسود" },
  { name: "navy", var: "--color-navy", note: "مرساة الهوية" },
  { name: "slate", var: "--color-slate", note: "نص مكتوم" },
  { name: "border", var: "--color-border", note: "حدود" },
  { name: "border-strong", var: "--color-border-strong", note: "حدود قوية" },
  { name: "orange", var: "--color-orange", note: "العلامة / CTA" },
  { name: "orange-dark", var: "--color-orange-dark", note: "hover" },
  { name: "orange-soft", var: "--color-orange-soft", note: "خلفية ناعمة" },
  { name: "success", var: "--color-success", note: "نجاح" },
  { name: "mint", var: "--color-mint", note: "لمسة نجاح" },
  { name: "warning", var: "--color-warning", note: "تحذير" },
  { name: "danger", var: "--color-danger", note: "خطأ" },
  { name: "info", var: "--color-info", note: "معلومة" },
];

const radiusTokens = [
  { name: "xs", var: "--radius-xs" },
  { name: "sm", var: "--radius-sm" },
  { name: "md", var: "--radius-md" },
  { name: "lg", var: "--radius-lg" },
  { name: "xl", var: "--radius-xl" },
  { name: "2xl", var: "--radius-2xl" },
];

const typeScale: Array<{ label: string; className: string; sample: string }> = [
  { label: "H1", className: "text-4xl font-bold sm:text-5xl", sample: "نشغّل مرافقك ونحمي أصولك" },
  { label: "H2", className: "text-3xl font-bold", sample: "شريك واحد، منظومة متكاملة" },
  { label: "H3", className: "text-xl font-bold", sample: "إدارة المرافق والتشغيل" },
  { label: "Body L", className: "text-lg text-slate", sample: "حلول متكاملة لإدارة المرافق والصيانة والخدمات المساندة." },
  { label: "Body", className: "text-base text-slate", sample: "نصمم منظومة خدمات تحت إدارة واحدة." },
  { label: "Small", className: "text-sm text-slate", sample: "خدمة طوارئ فنية على مدار الساعة." },
];

function Swatch({ token }: { token: { name: string; var: string; note: string } }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-navy/10 bg-white shadow-soft">
      <div className="h-16 w-full" style={{ background: `var(${token.var})` }} />
      <div className="p-3">
        <p className="font-mono text-xs font-bold text-navy">{token.name}</p>
        <p className="mt-0.5 text-[11px] text-slate">{token.note}</p>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-navy/10 pt-10">
      <h2 className="text-2xl font-bold text-navy">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default async function DesignSystemPage({ params }: { params: Promise<{ locale: string }> }) {
  if (isGated()) notFound();
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;

  return (
    <Section tone="white">
      <Container>
        <div className="mb-10">
          <Badge tone="pending">صفحة داخلية — غير مفهرسة</Badge>
          <h1 className="mt-4 text-3xl font-bold text-navy sm:text-4xl">نظام التصميم — اجتياز الخليج</h1>
          <p className="mt-3 max-w-2xl text-slate">
            مرجع مكوّنات وتوكنز الهوية (مستلهم من نظام Taskatk). يعرض الألوان والخطوط والحواف والأزرار والبطاقات والحقول
            وحالاتها للمراجعة البصرية.
          </p>
        </div>

        <div className="space-y-12">
          <Group title="الألوان (Color Tokens)">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {colorTokens.map((token) => (
                <Swatch key={token.name} token={token} />
              ))}
            </div>
          </Group>

          <Group title="الخطوط (Typography)">
            <div className="space-y-5">
              {typeScale.map((row) => (
                <div key={row.label} className="flex flex-col gap-1 border-b border-navy/5 pb-4 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="w-16 shrink-0 font-mono text-xs text-slate">{row.label}</span>
                  <span className={row.className}>{row.sample}</span>
                </div>
              ))}
            </div>
          </Group>

          <Group title="الحواف (Radius)">
            <div className="flex flex-wrap gap-6">
              {radiusTokens.map((token) => (
                <div key={token.name} className="text-center">
                  <div
                    className="size-20 border border-navy/15 bg-orange/10"
                    style={{ borderRadius: `var(${token.var})` }}
                  />
                  <p className="mt-2 font-mono text-xs text-slate">{token.name}</p>
                </div>
              ))}
            </div>
          </Group>

          <Group title="الأزرار (Buttons)">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">أساسي</Button>
              <Button variant="secondary">ثانوي</Button>
              <Button variant="outline">إطار</Button>
              <Button variant="ghost">شفاف</Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button size="sm">صغير</Button>
              <Button size="md">متوسط</Button>
              <Button size="lg">كبير</Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-[var(--radius-lg)] bg-navy p-5">
              <Button variant="primary">أساسي</Button>
              <Button variant="outline-inverse">إطار معكوس</Button>
            </div>
          </Group>

          <Group title="الشارات (Badges)">
            <div className="flex flex-wrap gap-3">
              <Badge tone="sand">رملي</Badge>
              <Badge tone="orange">برتقالي</Badge>
              <Badge tone="success">نجاح</Badge>
              <Badge tone="pending">قيد التوثيق</Badge>
            </div>
          </Group>

          <Group title="البطاقات (Cards)">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft">
                <h3 className="font-bold text-navy">بطاقة قياسية</h3>
                <p className="mt-2 text-sm text-slate">حدود + ظل ناعم على سطح أبيض.</p>
              </div>
              <div className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <h3 className="font-bold text-navy">بطاقة تفاعلية</h3>
                <p className="mt-2 text-sm text-slate">ترتفع قليلًا عند المرور مع ظل أقوى.</p>
              </div>
              <div className="rounded-[var(--radius-card)] border border-navy/10 bg-navy p-6 text-white">
                <h3 className="font-bold">بطاقة داكنة</h3>
                <p className="mt-2 text-sm text-white/75">على خلفية الهوية الكحلية.</p>
              </div>
            </div>
          </Group>

          <Group title="الحقول (Form Fields)">
            <div className="grid max-w-lg grid-cols-1 gap-5">
              <div>
                <label htmlFor="ds-name" className="mb-2 block text-sm font-semibold text-navy">
                  الاسم الكامل<span className="text-orange"> *</span>
                </label>
                <input
                  id="ds-name"
                  placeholder="اكتب اسمك"
                  className="focus-ring w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy placeholder:text-slate/60 transition-colors focus:border-orange"
                />
              </div>
              <div>
                <label htmlFor="ds-msg" className="mb-2 block text-sm font-semibold text-navy">
                  رسالة
                </label>
                <textarea
                  id="ds-msg"
                  placeholder="اكتب تفاصيل إضافية"
                  className="focus-ring min-h-24 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy placeholder:text-slate/60 transition-colors focus:border-orange"
                />
              </div>
              <p className="text-xs text-slate">
                الحالة: {locale === "ar" ? "عربي (RTL)" : "English (LTR)"} — الحقول ترث نفس حلقة التركيز البرتقالية.
              </p>
            </div>
          </Group>
        </div>
      </Container>
    </Section>
  );
}
