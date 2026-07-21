import type { Metadata } from "next";
import Link from "next/link";
import { ibmPlexSansArabic, inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Not Found | اجتياز الخليج للمقاولات",
  description: "The page you are looking for does not exist. الصفحة غير موجودة.",
};

export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexSansArabic.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-6 bg-sand px-4 py-24 text-center text-navy">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange">404</p>
        <div>
          <h1 className="text-2xl font-bold">الصفحة غير موجودة</h1>
          <p className="mt-2 text-slate">الصفحة التي تبحث عنها غير متاحة أو تم نقلها.</p>
        </div>
        <div dir="ltr" className="border-t border-navy/10 pt-6" style={{ fontFamily: "var(--font-sans-en)" }}>
          <h2 className="text-xl font-bold">Page Not Found</h2>
          <p className="mt-2 text-slate">The page you&apos;re looking for isn&apos;t available or has been moved.</p>
        </div>
        <div className="mt-2 flex gap-3">
          <Link
            href="/ar"
            className="focus-ring rounded-[var(--radius-pill)] bg-orange px-5 py-2.5 text-sm font-semibold text-white"
          >
            الصفحة الرئيسية
          </Link>
          <Link
            href="/en"
            className="focus-ring rounded-[var(--radius-pill)] border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy"
          >
            Home (English)
          </Link>
        </div>
      </body>
    </html>
  );
}
