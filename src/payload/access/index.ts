import type { Access, AccessArgs, FieldAccess } from "payload";

export const ROLES = ["super-admin", "content-manager", "sales", "analyst", "viewer"] as const;
export type Role = (typeof ROLES)[number];

type PayloadUser = { roles?: Role[] | null } | null | undefined;

function userHasRole(user: PayloadUser, roles: Role[]): boolean {
  if (!user?.roles) return false;
  return user.roles.some((role) => roles.includes(role));
}

/** Anyone, including logged-out visitors (used for public read of published content). */
export const anyone: Access = () => true;

/** Any authenticated user regardless of role. */
export const authenticated = ({ req: { user } }: AccessArgs): boolean => Boolean(user);

/**
 * Public visitors only ever see published documents; any authenticated
 * back-office user (any role) can see drafts too, since drafts are
 * intentionally visible in the admin/preview for review. Combine with a
 * more specific role check on `update`/`delete` where needed.
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true;
  return { _status: { equals: "published" } };
};

/** Factory: allow when the logged-in user has one of the given roles. */
export function hasRole(...roles: Role[]): Access {
  return ({ req: { user } }) => userHasRole(user as PayloadUser, roles);
}

export const isSuperAdmin = hasRole("super-admin");
export const isContentEditor = hasRole("super-admin", "content-manager");
export const isSalesTeam = hasRole("super-admin", "sales");
export const isAnalyst = hasRole("super-admin", "analyst");
export const isBackOffice = hasRole("super-admin", "content-manager", "sales", "analyst", "viewer");

/** Nobody may mutate directly through the API/admin UI — system-written only. */
export const systemWriteOnly: Access = () => false;

export function fieldHasRole(...roles: Role[]): FieldAccess {
  return ({ req: { user } }) => userHasRole(user as PayloadUser, roles);
}
