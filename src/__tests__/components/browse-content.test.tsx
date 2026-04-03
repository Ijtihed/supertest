import { describe, it, expect } from "vitest";
import { fireEvent } from "@testing-library/react";
import { BrowseContent } from "@/components/games/browse-content";
import { renderWithProviders as render } from "../test-utils";

const mockGames = [
  {
    id: "1",
    owner_id: "u1",
    title: "NEON_GAME",
    description: "",
    cover_image_url: null,
    game_type: "link" as const,
    game_url: null,
    file_path: null,
    platforms: ["PC"],
    genres: [],
    visibility: "public" as const,
    invite_code: "a",
    status: "active" as const, is_live: false, live_session_url: null, collaborator_ids: [],
    created_at: "2025-01-01T00:00:00Z",
    profiles: { display_name: "Dev1", avatar_url: null },
  },
  {
    id: "2",
    owner_id: "u2",
    title: "PUZZLE_VOID",
    description: "",
    cover_image_url: null,
    game_type: "web" as const,
    game_url: null,
    file_path: null,
    platforms: ["Web"],
    genres: [],
    visibility: "public" as const,
    invite_code: "b",
    status: "active" as const, is_live: false, live_session_url: null, collaborator_ids: [],
    created_at: "2025-01-02T00:00:00Z",
    profiles: { display_name: "Dev2", avatar_url: null },
  },
];

describe("BrowseContent", () => {
  it("renders all games by default", () => {
    const { container } = render(
      <BrowseContent games={mockGames} feedbackCounts={{}} />,
    );
    expect(container.textContent).toContain("NEON_GAME");
    expect(container.textContent).toContain("PUZZLE_VOID");
  });

  it("filters games by platform", () => {
    const { container } = render(
      <BrowseContent games={mockGames} feedbackCounts={{}} />,
    );
    const filterButtons = container.querySelectorAll("button");
    const webBtn = Array.from(filterButtons).find(
      (btn) => btn.textContent === "WEB"
    );
    if (webBtn) fireEvent.click(webBtn);

    expect(container.textContent).not.toContain("NEON_GAME");
    expect(container.textContent).toContain("PUZZLE_VOID");
  });

  it("renders developer names", () => {
    const { container } = render(
      <BrowseContent games={mockGames} feedbackCounts={{}} />,
    );
    expect(container.textContent).toContain("Dev1");
    expect(container.textContent).toContain("Dev2");
  });

  it("shows empty state when no games match filters", () => {
    const { container } = render(
      <BrowseContent games={[]} feedbackCounts={{}} />,
    );
    expect(container.textContent).toContain("No games");
  });
});
