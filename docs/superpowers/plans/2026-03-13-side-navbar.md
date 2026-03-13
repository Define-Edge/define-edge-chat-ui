# Side Navbar Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the sticky top `Navbar` on desktop with a fixed 40px-wide left side strip containing nav icons; keep mobile layout unchanged.

**Architecture:** Add a new `SideNavStrip` component (desktop-only, fixed left) that reuses the existing `chatHistoryOpen` query param to open the Sheet sidebar. Update `layout.tsx` to pass the strip + content column as children to `NavigationShell`. Adjust `page.tsx` height calc for the removal of the top bar on desktop.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS, Radix UI (Sheet, Tooltip), nuqs, lucide-react

---

## Chunk 1: Foundation + SideNavStrip component

### Task 1: Update SheetOverlay backdrop

**Files:**
- Modify: `src/components/ui/sheet.tsx:57`

- [ ] **Step 1: Replace `bg-black/80` with `backdrop-blur-sm bg-black/40` in `SheetOverlay`**

In `src/components/ui/sheet.tsx`, find the `SheetOverlay` function (line ~57). Change:

```tsx
"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
```

To:

```tsx
"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm bg-black/40",
```

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/sheet.tsx
git commit -m "feat: add blur backdrop to Sheet overlay"
```

---

### Task 2: Hide Navbar on desktop

**Files:**
- Modify: `src/components/layouts/Navbar.tsx:12`

- [ ] **Step 1: Add `md:hidden` to the outer wrapper div**

In `src/components/layouts/Navbar.tsx`, change line 12 from:

```tsx
<div className="sticky top-0 h-16 md:px-4">
```

To:

```tsx
<div className="sticky top-0 h-16 md:hidden">
```

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/layouts/Navbar.tsx
git commit -m "feat: hide top Navbar on desktop (replaced by SideNavStrip)"
```

---

### Task 3: Create SideNavStrip component

**Files:**
- Create: `src/components/layouts/SideNavStrip.tsx`

- [ ] **Step 1: Create the file**

Create `src/components/layouts/SideNavStrip.tsx` with the following content:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Compass, Database, History, Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";

const NAV_ITEMS = [
  { href: "/", icon: Plus, label: "New Chat", exact: true },
  { href: "/import", icon: Database, label: "Import", exact: false },
  { href: "/discover", icon: Compass, label: "Discover", exact: false },
  { href: "/history", icon: History, label: "Memory", exact: false },
] as const;

export function SideNavStrip() {
  const pathname = usePathname();
  const [, setSidebarOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );

  return (
    <div className="fixed left-0 top-0 z-10 hidden h-full w-10 flex-col items-center bg-slate-900 py-2 md:flex">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation"
        className="mb-2 text-white hover:bg-slate-800 hover:text-white"
      >
        <Menu className="size-5" />
      </Button>

      {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
        const isActive = exact
          ? pathname === href
          : pathname.startsWith(href);
        return (
          <Tooltip key={href}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={label}
                className={
                  isActive
                    ? "text-blue-400 hover:bg-slate-800 hover:text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
                asChild
              >
                <Link href={href}>
                  <Icon className="size-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: no errors

- [ ] **Step 3: Run build to catch any type errors**

```bash
pnpm build
```

Expected: successful build (component is exported but not yet used — this is fine)

- [ ] **Step 4: Commit**

```bash
git add src/components/layouts/SideNavStrip.tsx
git commit -m "feat: add SideNavStrip component for desktop navigation"
```

> **Note:** `SideNavStrip` is wired into the layout in Chunk 2, Task 4.

---

## Chunk 2: Layout wiring + height fix

> **Prerequisites:** Chunk 1 must be complete before starting this chunk.
> - `SideNavStrip.tsx` is created in Chunk 1 Task 3
> - `Navbar.tsx` has `md:hidden` added in Chunk 1 Task 2 — this is what hides the top bar on desktop

### Task 4: Wire SideNavStrip into layout.tsx

**Files:**
- Modify: `src/app/(main)/layout.tsx`

- [ ] **Step 1: Update layout to use SideNavStrip**

Replace the entire content of `src/app/(main)/layout.tsx` with:

```tsx
import BottomNavbar from "@/components/layouts/BottomNavbar";
import Navbar from "@/components/layouts/Navbar";
import { NavigationShell } from "@/components/layouts/NavigationShell";
import { SideNavStrip } from "@/components/layouts/SideNavStrip";
import { ClientProviders } from "@/components/providers/ClientProviders";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ClientProviders>
        <NavigationShell>
          <SideNavStrip />
          <div className="flex min-h-dvh flex-col md:pl-10">
            <Navbar />
            {children}
            <BottomNavbar />
          </div>
        </NavigationShell>
      </ClientProviders>
    </React.Suspense>
  );
}
```

Notes:
- `SideNavStrip` is `fixed` so it does not affect document flow; `md:pl-10` (40px) offsets content from under it
- `md:pl-10` must equal the strip width (`w-10` = 40px) — keep these in sync
- `NavigationShell` is unchanged; the Sheet it renders is a Radix portal so placement here doesn't matter

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/\(main\)/layout.tsx
git commit -m "feat: wire SideNavStrip into main layout"
```

---

### Task 5: Fix page.tsx height calculation

**Files:**
- Modify: `src/app/(main)/page.tsx`

- [ ] **Step 1: Replace desktop height calc**

In `src/app/(main)/page.tsx`, change:

```tsx
className={cn(
  "md:h-[calc(100dvh-4rem)]",
  isKeyboardOpen
    ? "h-[calc(100dvh-4rem)]"
    : "h-[calc(100dvh-4rem-var(--bottom-navbar-height))]",
)}
```

To:

```tsx
className={cn(
  "md:h-dvh",
  isKeyboardOpen
    ? "h-[calc(100dvh-4rem)]"
    : "h-[calc(100dvh-4rem-var(--bottom-navbar-height))]",
)}
```

The mobile branches intentionally keep subtracting `4rem` — `Navbar` still renders on mobile and is still `h-16`.

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/\(main\)/page.tsx
git commit -m "fix: use full dvh height on desktop after removing top Navbar"
```

---

### Task 6: Future-proof PageHeader sidebar trigger

**Files:**
- Modify: `src/components/layouts/PageHeader.tsx`

- [ ] **Step 1: Hide sidebar trigger button on desktop**

In `src/components/layouts/PageHeader.tsx`, add `md:hidden` to the sidebar toggle `Button`:

```tsx
<Button
  variant="ghost"
  size="icon"
  onClick={() => setSidebarOpen(true)}
  className="hover:bg-gray-100 md:hidden"
>
  <PanelRightClose className="size-5" />
</Button>
```

Note: `PageHeader` has no consumers in the codebase currently — this is future-proofing so that if it gets used on desktop pages, the `SideNavStrip` hamburger remains the sole desktop trigger.

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: no errors

- [ ] **Step 3: Run build to confirm no TypeScript errors**

```bash
pnpm build
```

Expected: successful build, no type errors

- [ ] **Step 4: Commit**

```bash
git add src/components/layouts/PageHeader.tsx
git commit -m "feat: hide PageHeader sidebar trigger on desktop"
```

---

### Task 7: Visual verification

- [ ] **Step 1: Start dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Verify desktop layout (browser width ≥ 768px)**

Open http://localhost:3000 and confirm:
- Thin dark left strip is visible with hamburger at top + 4 nav icons below
- No top bar / gradient bar visible
- Clicking hamburger opens the sidebar with blurred backdrop
- Sidebar closes on backdrop click or X button
- Active page icon is highlighted blue
- Hovering icons shows tooltips on the right side
- Navigating to `/discover/...` keeps Discover icon highlighted

- [ ] **Step 3: Verify mobile layout (browser width < 768px, or DevTools mobile)**

Confirm:
- Top navbar with gradient + app name is visible
- Left strip is NOT visible
- Bottom navigation tabs are visible
- Hamburger in top bar opens sidebar

- [ ] **Step 4: Final build check**

```bash
pnpm build
```

Expected: clean build
