import { describe, it, expect, vi, beforeEach } from "vitest";
import { Sidebar } from "@/components/layout/sidebar";
import { renderWithProviders as render } from "../test-utils";

let mockPathname = "/dashboard";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Sidebar navigation active states", () => {
  beforeEach(() => {
    mockPathname = "/dashboard";
  });

  it("does NOT double-highlight BROWSE and BUILDS on /games/new", () => {
    mockPathname = "/games/new";
    const { container } = render(<Sidebar profile={null} />);

    const browseLink = container.querySelector('a[href="/games"]');
    const buildsLink = container.querySelector('a[href="/games/new"]');

    expect(browseLink?.className).toContain("text-muted");
    expect(browseLink?.className).not.toContain("border-primary");

    expect(buildsLink?.className).toContain("text-primary");
    expect(buildsLink?.className).toContain("border-primary");
  });

  it("highlights only BROWSE on /games", () => {
    mockPathname = "/games";
    const { container } = render(<Sidebar profile={null} />);

    const browseLink = container.querySelector('a[href="/games"]');
    const buildsLink = container.querySelector('a[href="/games/new"]');

    expect(browseLink?.className).toContain("border-primary");
    expect(buildsLink?.className).toContain("text-muted");
  });

  it("highlights nothing extra on a game detail page", () => {
    mockPathname = "/games/some-uuid-here";
    const { container } = render(<Sidebar profile={null} />);

    const browseLink = container.querySelector('a[href="/games"]');
    const buildsLink = container.querySelector('a[href="/games/new"]');
    const dashLink = container.querySelector('a[href="/dashboard"]');

    expect(browseLink?.className).toContain("text-muted");
    expect(buildsLink?.className).toContain("text-muted");
    expect(dashLink?.className).toContain("text-muted");
  });

  it("highlights only LEADERBOARD on /leaderboard", () => {
    mockPathname = "/leaderboard";
    const { container } = render(<Sidebar profile={null} />);

    const leaderboardLink = container.querySelector('a[href="/leaderboard"]');
    const dashLink = container.querySelector('a[href="/dashboard"]');

    expect(leaderboardLink?.className).toContain("border-primary");
    expect(dashLink?.className).toContain("text-muted");
  });
});
