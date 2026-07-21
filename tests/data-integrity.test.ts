import { describe, expect, it } from "vitest";
import { solutions } from "@/data/solutions";
import { sectors } from "@/data/sectors";
import { solutionFamilies } from "@/data/solution-families";
import { caseStudies } from "@/data/projects";

const solutionSlugs = new Set(solutions.map((solution) => solution.slug));
const sectorSlugs = new Set(sectors.map((sector) => sector.slug));

describe("data cross-references", () => {
  it("every sector's relevantSolutions points to a real solution", () => {
    for (const sector of sectors) {
      for (const slug of sector.relevantSolutions) {
        expect(solutionSlugs.has(slug), `sector "${sector.slug}" references unknown solution "${slug}"`).toBe(true);
      }
    }
  });

  it("every solution's sectors list points to a real sector", () => {
    for (const solution of solutions) {
      for (const slug of solution.sectors) {
        expect(sectorSlugs.has(slug), `solution "${solution.slug}" references unknown sector "${slug}"`).toBe(true);
      }
    }
  });

  it("every solution family points to real solutions", () => {
    for (const family of solutionFamilies) {
      expect(solutionSlugs.has(family.primarySlug), `family "${family.id}" has unknown primarySlug`).toBe(true);
      for (const slug of family.solutionSlugs) {
        expect(solutionSlugs.has(slug), `family "${family.id}" references unknown solution "${slug}"`).toBe(true);
      }
    }
  });

  it("every case study references a real sector and solution", () => {
    for (const caseStudy of caseStudies) {
      expect(sectorSlugs.has(caseStudy.sectorSlug), `case study "${caseStudy.slug}" has unknown sector`).toBe(true);
      expect(solutionSlugs.has(caseStudy.solutionSlug), `case study "${caseStudy.slug}" has unknown solution`).toBe(
        true
      );
    }
  });

  it("has unique slugs across solutions, sectors, and case studies", () => {
    expect(new Set(solutions.map((s) => s.slug)).size).toBe(solutions.length);
    expect(new Set(sectors.map((s) => s.slug)).size).toBe(sectors.length);
    expect(new Set(caseStudies.map((c) => c.slug)).size).toBe(caseStudies.length);
  });

  it("gives every solution at least one FAQ and 4+ scope items", () => {
    for (const solution of solutions) {
      expect(solution.faqs.length, `solution "${solution.slug}" has no FAQs`).toBeGreaterThan(0);
      expect(solution.scope.length, `solution "${solution.slug}" has too few scope items`).toBeGreaterThanOrEqual(4);
    }
  });
});
