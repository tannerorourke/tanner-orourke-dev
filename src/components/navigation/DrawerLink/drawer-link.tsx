'use client';

/**
 * In-text link that opens a header drawer in place, the same action as the header's own control.
 * 'href' stays the '?view=<drawer>' deep link: a modified click, a new tab or a no-JS visit
 * lands on it and DrawerProvider opens the drawer on load. Markdown renders it for drawer links.
 */
import type { MouseEvent, ReactNode } from "react";

import { useDrawer, type DrawerId } from "@/components/providers/DrawerProvider";


export type DrawerLinkProps = {
  drawer: DrawerId;
  href: string;
  className?: string;
  children: ReactNode;
};

export function DrawerLink({ drawer, href, className, children }: DrawerLinkProps) {
  const { openDrawer } = useDrawer();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openDrawer(drawer);
  };

  return <a href={href} className={className} onClick={onClick}>{children}</a>;
}
