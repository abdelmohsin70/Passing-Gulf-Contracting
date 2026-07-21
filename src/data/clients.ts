export type ClientLogo = {
  name: string;
  logoSrc: string;
  serviceLabel?: { ar: string; en: string };
};

/**
 * TODO_VERIFY: the brochure shows an "Our Clients" logo wall, but no usage
 * rights or confirmed logo files were supplied. Keep this list empty (and
 * ClientLogoGrid hidden) until the client confirms which logos may be
 * published.
 */
export const clientLogos: ClientLogo[] = [];
