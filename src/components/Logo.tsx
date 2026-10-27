export function Logo({ className }: { className?: string }) {
    return (
        <img
            src="/favicon.svg"
            alt="Zertainity Logo"
            className={className || "h-8 w-8"}
        />
    );
}
