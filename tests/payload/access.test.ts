import { describe, expect, it } from "vitest";
import {
  anyone,
  authenticated,
  authenticatedOrPublished,
  hasRole,
  isSuperAdmin,
  isContentEditor,
  isSalesTeam,
  isAnalyst,
  isBackOffice,
  systemWriteOnly,
  fieldHasRole,
} from "@/payload/access";

function ctx(user: { roles?: string[] } | null) {
  return { req: { user } } as never;
}

describe("payload access control", () => {
  it("anyone always allows, logged in or not", () => {
    expect(anyone(ctx(null))).toBe(true);
    expect(anyone(ctx({ roles: ["viewer"] }))).toBe(true);
  });

  it("authenticated requires a user, any role", () => {
    expect(authenticated(ctx(null))).toBe(false);
    expect(authenticated(ctx({ roles: [] }))).toBe(true);
  });

  it("authenticatedOrPublished lets logged-in users see everything, anonymous users only published", () => {
    expect(authenticatedOrPublished(ctx({ roles: ["viewer"] }))).toBe(true);
    expect(authenticatedOrPublished(ctx(null))).toEqual({ _status: { equals: "published" } });
  });

  it("hasRole factory allows only listed roles", () => {
    const salesOnly = hasRole("sales");
    expect(salesOnly(ctx({ roles: ["sales"] }))).toBe(true);
    expect(salesOnly(ctx({ roles: ["analyst"] }))).toBe(false);
    expect(salesOnly(ctx(null))).toBe(false);
  });

  it("isSuperAdmin only allows super-admin", () => {
    expect(isSuperAdmin(ctx({ roles: ["super-admin"] }))).toBe(true);
    expect(isSuperAdmin(ctx({ roles: ["content-manager"] }))).toBe(false);
  });

  it("isContentEditor allows super-admin and content-manager only", () => {
    expect(isContentEditor(ctx({ roles: ["content-manager"] }))).toBe(true);
    expect(isContentEditor(ctx({ roles: ["super-admin"] }))).toBe(true);
    expect(isContentEditor(ctx({ roles: ["sales"] }))).toBe(false);
  });

  it("isSalesTeam allows super-admin and sales only", () => {
    expect(isSalesTeam(ctx({ roles: ["sales"] }))).toBe(true);
    expect(isSalesTeam(ctx({ roles: ["analyst"] }))).toBe(false);
  });

  it("isAnalyst allows super-admin and analyst only", () => {
    expect(isAnalyst(ctx({ roles: ["analyst"] }))).toBe(true);
    expect(isAnalyst(ctx({ roles: ["viewer"] }))).toBe(false);
  });

  it("isBackOffice allows any of the five defined roles", () => {
    for (const role of ["super-admin", "content-manager", "sales", "analyst", "viewer"]) {
      expect(isBackOffice(ctx({ roles: [role] }))).toBe(true);
    }
    expect(isBackOffice(ctx(null))).toBe(false);
  });

  it("systemWriteOnly always denies, even for super-admin", () => {
    expect(systemWriteOnly(ctx({ roles: ["super-admin"] }))).toBe(false);
    expect(systemWriteOnly(ctx(null))).toBe(false);
  });

  it("fieldHasRole mirrors hasRole but for field-level access", () => {
    const restricted = fieldHasRole("super-admin", "content-manager");
    expect(restricted(ctx({ roles: ["content-manager"] }))).toBe(true);
    expect(restricted(ctx({ roles: ["sales"] }))).toBe(false);
  });

  it("a user with multiple roles matches if any one is allowed", () => {
    const salesOnly = hasRole("sales");
    expect(salesOnly(ctx({ roles: ["viewer", "sales"] }))).toBe(true);
  });
});
