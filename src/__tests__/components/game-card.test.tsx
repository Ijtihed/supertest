import { describe, it, expect } from "vitest";
import { GameCard } from "@/components/games/game-card";
import { renderWithProviders as render } from "../test-utils";
import type { Game } from "@/lib/types/database";

const mockGame: Game = {
  id: "test-123",
  owner_id: "user-1",
  title: "NEON_DRIFT_2049",
  description: "A test game",
  cover_image_url: null,
  game_type: "link",
  game_url: "https://example.com",
  file_path: null,
  platforms: ["Windows", "Linux"],
  genres: ["Racing", "Cyberpunk"],
  visibility: "public",
  invite_code: "abc123",
  status: "active",
  created_at: "2025-01-01T00:00:00Z",
};

describe("GameCard", () => {
  it("renders game title and links correctly", () => {
    const { container } = render(<GameCard game={mockGame} />);
    expect(container.textContent).toContain("NEON_DRIFT_2049");
    const link = container.querySelector("a");
    expect(link).toHaveAttribute("href", "/games/test-123");
  });

  it("renders genre tags and platform info", () => {
    const { container } = render(<GameCard game={mockGame} />);
    expect(container.textContent).toContain("Racing");
    expect(container.textContent).toContain("Cyberpunk");
    expect(container.textContent).toContain("Windows, Linux");
  });

  it("renders active status badge", () => {
    const { container } = render(<GameCard game={mockGame} />);
    expect(container.textContent).toContain("ACTIVE");
  });

  it("shows paused status correctly", () => {
    const pausedGame = { ...mockGame, status: "paused" as const };
    const { container } = render(<GameCard game={pausedGame} />);
    expect(container.textContent).toContain("PAUSED");
  });

  it("shows placeholder when no cover image", () => {
    const { container } = render(<GameCard game={mockGame} />);
    const icon = container.querySelector(".material-symbols-outlined");
    expect(icon).toBeTruthy();
  });
});
