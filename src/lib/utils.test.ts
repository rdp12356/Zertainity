import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges conditional and conflicting Tailwind classes", () => {
    expect(cn("px-2", "px-4", false && "hidden")).toBe("px-4");
  });

  it("handles conditional class values", () => {
    expect(cn("text-sm", true && "font-medium", false && "hidden")).toBe(
      "text-sm font-medium",
    );
  });
});
