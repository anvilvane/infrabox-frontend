"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ model */

export type NavLink = {
  href: string;
  label: string;
  description?: string;
};

export type NavGroup = {
  /** Column heading inside the panel. Omitted for single-column menus. */
  heading?: string;
  links: NavLink[];
};

export type NavItem =
  /** A plain link in the bar. */
  | { label: string; href: string }
  /** A trigger that opens a panel. */
  | { label: string; groups: NavGroup[]; footer?: NavLink };

function isMenu(item: NavItem): item is Extract<NavItem, { groups: NavGroup[] }> {
  return "groups" in item;
}

/* -------------------------------------------------------------------- bar */

/**
 * The desktop navigation bar.
 *
 * Every entry is a real route — the menus are generated from the same
 * registries the pages are, so a menu link cannot point at a page that does
 * not exist.
 *
 * Interaction: pointer hover opens (with a short close delay so a diagonal
 * mouse path to the panel does not dismiss it), click and Enter/Space toggle,
 * Escape closes and returns focus to the trigger, and focus leaving the whole
 * bar closes. That covers mouse, keyboard and touch without a separate mobile
 * implementation.
 */
export function SiteNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  }, [cancelClose]);

  // Navigating away must not leave a panel hanging over the new page.
  useEffect(() => {
    setOpen(null);
  }, [pathname]);

  useEffect(() => cancelClose, [cancelClose]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={barRef}
      className="hidden md:block"
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(null);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(null);
        }
      }}
    >
      <nav aria-label="Main">
        <ul className="flex items-center gap-1">
          {items.map((item) =>
            isMenu(item) ? (
              <MenuItem
                key={item.label}
                item={item}
                open={open === item.label}
                onOpen={() => {
                  cancelClose();
                  setOpen(item.label);
                }}
                onToggle={() =>
                  setOpen((current) => (current === item.label ? null : item.label))
                }
                onHoverOut={scheduleClose}
              />
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onMouseEnter={() => {
                    cancelClose();
                    setOpen(null);
                  }}
                  className={cn(
                    "block rounded-sm px-3 py-2 text-[0.8125rem] font-medium transition-colors",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------- item */

function MenuItem({
  item,
  open,
  onOpen,
  onToggle,
  onHoverOut,
}: {
  item: Extract<NavItem, { groups: NavGroup[] }>;
  open: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onHoverOut: () => void;
}) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const columns = item.groups.length;

  return (
    <li
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onHoverOut}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) triggerRef.current?.focus();
          if (event.key === "ArrowDown") {
            event.preventDefault();
            onOpen();
          }
        }}
        className={cn(
          "flex items-center gap-1.5 rounded-sm px-3 py-2 text-[0.8125rem] font-medium transition-colors",
          open ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {item.label}
        <Caret className={cn("transition-transform duration-150", open && "rotate-180")} />
      </button>

      {/* Rendered always, hidden when closed: the panel keeps its place in the
          DOM so a screen reader reaching the trigger can follow aria-controls,
          and so there is no mount flash on first open. */}
      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "absolute left-0 top-[calc(100%+0.5rem)] z-50",
          "border border-border bg-background shadow-[0_18px_44px_-24px_rgba(1,44,60,0.45)]",
          "rounded-[var(--radius)]",
        )}
        style={{ width: columns > 1 ? `${columns * 17.5}rem` : "20rem" }}
      >
        {/* The cyan specular rule from the logo, reused as the panel's edge. */}
        <div className="accent-edge" />

        <div
          className={cn("grid", columns > 1 && "divide-x divide-border")}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {item.groups.map((group, groupIndex) => (
            <div key={group.heading ?? groupIndex} className="py-2">
              {group.heading ? (
                <p className="px-4 pb-1.5 pt-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {group.heading}
                </p>
              ) : null}

              <ul>
                {group.links.map((link, linkIndex) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex gap-3 px-4 py-2.5 transition-colors hover:bg-brand-tint focus-visible:bg-brand-tint"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.1875rem] font-mono text-[0.625rem] tabular text-muted-foreground/70"
                      >
                        {String(linkIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.8125rem] font-medium text-foreground">
                          {link.label}
                        </span>
                        {link.description ? (
                          <span className="mt-0.5 block text-[0.75rem] leading-snug text-muted-foreground">
                            {link.description}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {item.footer ? (
          <div className="border-t border-border bg-muted/40">
            <Link
              href={item.footer.href}
              className="flex items-center justify-between gap-3 px-4 py-2.5 text-[0.8125rem] font-medium text-foreground transition-colors hover:bg-brand-tint"
            >
              {item.footer.label}
              <span aria-hidden className="text-muted-foreground">
                →
              </span>
            </Link>
          </div>
        ) : null}
      </div>
    </li>
  );
}

function Caret({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 10 6"
      width="9"
      height="6"
      fill="none"
      className={className}
    >
      <path
        d="M1 1l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

/* ----------------------------------------------------------- compact bar */

/**
 * Narrow screens get a flat, scrollable row of every link — no drawer, no
 * toggle state. Desktop is the priority for now, and a flattened list cannot
 * get stuck open.
 */
export function CompactNav({ items }: { items: NavItem[] }) {
  const flat: NavLink[] = items.flatMap((item) =>
    isMenu(item)
      ? [
          ...item.groups.flatMap((group) => group.links),
          ...(item.footer ? [item.footer] : []),
        ]
      : [{ href: item.href, label: item.label }],
  );

  const seen = new Set<string>();
  const links = flat.filter((link) =>
    seen.has(link.href) ? false : (seen.add(link.href), true),
  );

  return (
    <nav aria-label="Main (compact)" className="border-t border-border md:hidden">
      <ul className="flex items-center gap-5 overflow-x-auto px-4 py-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block whitespace-nowrap text-[0.8125rem] font-medium text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
