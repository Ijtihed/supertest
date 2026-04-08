import { describe, it, expect } from "vitest";
import { Footer } from "@/components/layout/footer";
import { renderWithProviders as render } from "../test-utils";

describe("Footer", () => {
  it("renders supertest branding", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain("supertest");
  });

  it("renders navigation links", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain("GITHUB");
    expect(container.textContent).toContain("SECURITY");
  });

  it("applies sidebar margin when withSidebar is true", () => {
    const { container } = render(<Footer withSidebar />);
    const footer = container.querySelector("footer");
    expect(footer?.className).toContain("ml-[220px]");
  });

  it("does not apply sidebar margin by default", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer?.className).not.toContain("ml-[220px]");
  });
});
