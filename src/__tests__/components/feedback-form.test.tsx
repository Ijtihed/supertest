import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { renderWithProviders as render } from "../test-utils";
import type { Game, FeedbackQuestion } from "@/lib/types/database";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getUser: () => Promise.resolve({ data: { user: { id: "u1" } } }) },
    from: () => ({
      insert: () => ({ error: null }),
    }),
  }),
}));

const mockGame: Game = {
  id: "game-1",
  owner_id: "user-1",
  title: "TEST_GAME",
  description: "desc",
  cover_image_url: null,
  game_type: "link",
  game_url: null,
  file_path: null,
  platforms: [],
  genres: [],
  visibility: "public",
  invite_code: "abc",
  status: "active",
  created_at: "2025-01-01T00:00:00Z",
};

const mockQuestions: FeedbackQuestion[] = [
  {
    id: "q1",
    game_id: "game-1",
    question_text: "How was the tutorial?",
    question_type: "text",
    options: null,
    sort_order: 0,
  },
];

describe("FeedbackForm", () => {
  it("renders form with all major sections", () => {
    const { container } = render(
      <FeedbackForm game={mockGame} questions={[]} />
    );
    const text = container.textContent ?? "";
    expect(text).toContain("SUBMIT_FEEDBACK");
    expect(text).toContain("TEST_GAME");
    expect(text).toContain("GLOBAL_RATING");
    expect(text).toContain("GAMEPLAY_MECHANICS");
    expect(text).toContain("VISUAL_FIDELITY");
    expect(text).toContain("FUN_FACTOR");
    expect(text).toContain("PLAY_AGAIN_PROBABILITY");
    expect(text).toContain("VIDEO_EVIDENCE_LINKS");
    expect(text).toContain("ANYTHING_ELSE");
  });

  it("renders custom questions when provided", () => {
    const { container } = render(
      <FeedbackForm game={mockGame} questions={mockQuestions} />
    );
    expect(container.textContent).toContain("How was the tutorial?");
  });

  it("disables submit when no rating selected", () => {
    const { container } = render(
      <FeedbackForm game={mockGame} questions={[]} />
    );
    const submitBtn = container.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
  });

  it("enables submit after selecting a rating", () => {
    const { container } = render(
      <FeedbackForm game={mockGame} questions={[]} />
    );
    const ratingButtons = container.querySelectorAll(
      'button[type="button"]'
    );
    const fourthButton = Array.from(ratingButtons).find(
      (btn) => btn.textContent === "4"
    );
    if (fourthButton) fireEvent.click(fourthButton);

    const submitBtn = container.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(false);
  });
});
