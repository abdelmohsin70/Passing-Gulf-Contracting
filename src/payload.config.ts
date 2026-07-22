import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { ar } from "@payloadcms/translations/languages/ar";
import sharp from "sharp";

import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Pages } from "./payload/collections/Pages";
import { Solutions } from "./payload/collections/Solutions";
import { Sectors } from "./payload/collections/Sectors";
import { Projects } from "./payload/collections/Projects";
import { Insights } from "./payload/collections/Insights";
import { FAQs } from "./payload/collections/FAQs";
import { Testimonials } from "./payload/collections/Testimonials";
import { Clients } from "./payload/collections/Clients";
import { Certifications } from "./payload/collections/Certifications";
import { TeamMembers } from "./payload/collections/TeamMembers";
import { Leads } from "./payload/collections/Leads";
import { LeadActivities } from "./payload/collections/LeadActivities";
import { Careers } from "./payload/collections/Careers";
import { JobApplications } from "./payload/collections/JobApplications";
import { Redirects } from "./payload/collections/Redirects";
import { AuditLogs } from "./payload/collections/AuditLogs";
import { AnalyticsDaily } from "./payload/collections/AnalyticsDaily";

import { SiteSettings } from "./payload/globals/SiteSettings";
import { ContactSettings } from "./payload/globals/ContactSettings";
import { Homepage } from "./payload/globals/Homepage";
import { AboutPage } from "./payload/globals/AboutPage";
import { QualitySafetyPage } from "./payload/globals/QualitySafetyPage";
import { Header } from "./payload/globals/Header";
import { Footer } from "./payload/globals/Footer";
import { SEOSettings } from "./payload/globals/SEOSettings";
import { AnalyticsSettings } from "./payload/globals/AnalyticsSettings";
import { NotificationSettings } from "./payload/globals/NotificationSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — لوحة تحكم اجتياز الخليج",
    },
    dateFormat: "dd/MM/yyyy",
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      actions: ["@/payload/components/LanguageToggle#LanguageToggle"],
      beforeDashboard: ["@/payload/components/DashboardOverview#DashboardOverview"],
      graphics: {
        Logo: "@/payload/components/Logo#Logo",
        Icon: "@/payload/components/Icon#Icon",
      },
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Solutions,
    Sectors,
    Projects,
    Insights,
    FAQs,
    Testimonials,
    Clients,
    Certifications,
    TeamMembers,
    Leads,
    LeadActivities,
    Careers,
    JobApplications,
    Redirects,
    AuditLogs,
    AnalyticsDaily,
  ],
  globals: [
    SiteSettings,
    ContactSettings,
    Homepage,
    AboutPage,
    QualitySafetyPage,
    Header,
    Footer,
    SEOSettings,
    AnalyticsSettings,
    NotificationSettings,
  ],
  editor: lexicalEditor(),
  i18n: {
    supportedLanguages: { en, ar },
    fallbackLanguage: "ar",
  },
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  localization: {
    locales: [
      { label: "العربية", code: "ar", rtl: true },
      { label: "English", code: "en" },
    ],
    defaultLocale: "ar",
    fallback: true,
  },
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || ""].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || ""].filter(Boolean),
});
