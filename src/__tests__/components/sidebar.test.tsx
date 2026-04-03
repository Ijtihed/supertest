import { describe, it, expect, vi } from "vitest";
import { Sidebar } from "@/components/layout/sidebar";
import { renderWithProviders as render } from "../test-utils";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ push: vi.fn() }),
}));

const mockProfile = {
  id: "u1",
  display_name: "Test User",
  avatar_url: null,
  cohort: "helsinki" as const,
  status: "approved" as const,
  is_admin: false,
  supercell_email: "user@example.com",
  review_points: 0,
  created_at: "2025-01-01T00:00:00Z",
};

describe("Sidebar", () => {
  it("renders the Supertest brand", () => {
    const { container } = render(<Sidebar profile={mockProfile} />);
    expect(container.textContent).toContain("Supertest");
  });

  it("renders all nav items", () => {
    const { container } = render(<Sidebar profile={mockProfile} />);
    expect(container.textContent).toContain("DASHBOARD");
    expect(container.textContent).toContain("BROWSE");
    expect(container.textContent).toContain("BUILDS");
    expect(container.textContent).toContain("LEADERBOARD");
    expect(container.textContent).toContain("SETTINGS");
  });

  it("shows user profile and cohort when provided", () => {
    const { container } = render(<Sidebar profile={mockProfile} />);
    expect(container.textContent).toContain("TEST USER");
    expect(container.textContent).toContain("HELSINKI");
  });

  it("hides user profile when null", () => {
    const { container } = render(<Sidebar profile={null} />);
    expect(container.textContent).not.toContain("HELSINKI");
  });

  it("highlights active nav item with border-primary", () => {
    const { container } = render(<Sidebar profile={null} />);
    const dashLink = container.querySelector('a[href="/dashboard"]');
    expect(dashLink?.className).toContain("border-primary");
    expect(dashLink?.className).toContain("text-primary");
  });
});
