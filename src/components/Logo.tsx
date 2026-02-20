export function Logo({ className }: { className?: string }) {
    return (
        <img
            src="/logo.svg"
            alt="Zertainity Logo"
            className={className || "h-8 w-8"}
        />
    );
}
