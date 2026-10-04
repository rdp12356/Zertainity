import { cn } from "@/lib/utils";

const conditionalClass = (enabled: boolean, className: string) =>
  enabled && className;

describe("cn", () => {
  it("merges conditional and conflicting Tailwind classes", () => {
    expect(cn("px-2", "px-4", conditionalClass(false, "hidden"))).toBe("px-4");
  });

  it("handles conditional class values", () => {
    expect(
      cn(
        "text-sm",
        conditionalClass(true, "font-medium"),
        conditionalClass(false, "hidden"),
      ),
    ).toBe("text-sm font-medium");
  });
});
