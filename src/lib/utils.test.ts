import { cn } from "@/lib/utils";

const conditionalClass = (enabled: boolean) => enabled && "hidden";

describe("cn", () => {
  it("merges conditional and conflicting Tailwind classes", () => {
    expect(cn("px-2", "px-4", conditionalClass(false))).toBe("px-4");
  });

  it("handles conditional class values", () => {
    expect(cn("text-sm", conditionalClass(true), conditionalClass(false))).toBe(
      "text-sm hidden",
    );
  });
});
