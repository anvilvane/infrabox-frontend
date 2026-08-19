/**
 * Shown wherever a Calendly widget would go while NEXT_PUBLIC_CALENDLY_HANDLE is unset.
 *
 * Without this, the embed iframes point at a Calendly handle that does not exist yet and
 * render Calendly's 404 inside the page. This keeps every booking surface looking like
 * Infrabox and still gives the visitor a way to reach the team.
 */
export default function BookingFallback({
  title = "Book your strategy call",
  description = "Tell us what you're sending and we'll map the infrastructure to match — domains, mailboxes, warmup and DNS, set up for you.",
  email = "hey@infrabox.software",
  subject = "Strategy call request",
  className = "",
  compact = false,
}) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#bcd4fb] bg-[#f5f8ff] text-center ${
        compact ? "px-5 py-8" : "px-6 py-12"
      } ${className}`}
    >
      <img
        src="/logo-horizontal.png"
        alt=""
        aria-hidden="true"
        className={compact ? "mb-4 h-9 w-auto" : "mb-5 h-11 w-auto"}
      />

      <h3
        className={`font-bold tracking-tight text-[#1240cc] ${
          compact ? "text-lg" : "text-xl md:text-2xl"
        }`}
      >
        {title}
      </h3>

      <p
        className={`mx-auto mt-2 max-w-md text-balance text-[#1240cc]/70 ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        {description}
      </p>

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}
          className="inline-flex items-center justify-center rounded-full bg-[#1240cc] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0b34b4]"
        >
          Email the team
        </a>
        <a
          href="https://app.infrabox.software/signup"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-[#1240cc]/25 px-6 py-2.5 text-sm font-medium text-[#1240cc] transition-colors hover:bg-[#e8f0fe]"
        >
          Get started now
        </a>
      </div>

      <p className="mt-4 text-xs text-[#1240cc]/50">
        Replies within one business day.
      </p>
    </div>
  );
}
