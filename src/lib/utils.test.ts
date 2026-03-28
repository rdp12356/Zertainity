import { cn } from "./utils";

describe("cn", () => {
  it("merges and deduplicates tailwind classes", () => {
    expect(cn("p-2", "p-4", "text-sm")).toBe("p-4 text-sm");
  });
});
