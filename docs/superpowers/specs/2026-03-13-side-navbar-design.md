# Side Navbar Design Spec
**Date:** 2026-03-13

## Overview

Convert the top `Navbar` into a desktop-only left side navigation strip. On mobile, keep the existing top `Navbar` and `BottomNavbar` unchanged.

## Goals

- Desktop: replace the sticky top bar with a narrow (40px) fixed left strip containing nav icons and a hamburger to open the full sidebar overlay
- Mobile: no visual change — top `Navbar` and `BottomNavbar` remain as-is
- Expanded sidebar (overlay): slide from left with blurred/darkened backdrop

## Behavior

### Desktop (md+)
- A fixed 40px-wide left strip is always visible, `z-10`
- Top: hamburger icon → sets `chatHistoryOpen=true`
- Below hamburger: icon-only buttons for New Chat (`/`), Import (`/import`), Discover (`/discover`), Memory (`/history`)
- Active route highlighting:
  - `/` — exact match only (`pathname === "/"`)
  - All others — `pathname.startsWith(href)` so that sub-routes (e.g. `/discover/[strategy]`) keep the parent icon highlighted
- No top Navbar bar on desktop

### Mobile (< md)
- Top `Navbar` (hamburger button, sticky) — unchanged
- `BottomNavbar` — unchanged
- `SideNavStrip` is hidden (`hidden md:flex`)

### Expanded Sidebar Overlay
- Triggered by hamburger in `SideNavStrip` (desktop) or in `Navbar` (mobile) — both set the same `chatHistoryOpen` query param
- Sheet `side="left"` already set in `NavigationShell` — no change needed
- Backdrop: in `SheetOverlay`, **replace** `bg-black/80` with `backdrop-blur-sm bg-black/40`
- Only one Sheet usage in the app so this is safe
- Sheet overlay renders at `z-50` (Radix default), above `SideNavStrip` at `z-10`

### Viewport Resize
- `chatHistoryOpen` is a URL query param — Sheet stays open across resize. Acceptable default.

## Files to Change

### 1. `src/components/layouts/Navbar.tsx`
- Add `md:hidden` to the outer `<div>` wrapper
- **Co-dependent with File 6** (`page.tsx`) — these two changes must land together since the desktop height calc depends on the Navbar being present

### 2. `src/components/layouts/SideNavStrip.tsx` _(new file)_
- `"use client"`
- `hidden md:flex flex-col items-center` — desktop only
- `fixed left-0 top-0 h-full w-10 z-10`
- Background: match the app's dark sidebar tone (e.g. `bg-slate-900` or consistent with `NavigationShell` content background)
- **Hamburger button** (top):
  - `useQueryState("chatHistoryOpen", parseAsBoolean.withDefault(false))`
  - `variant="ghost" size="icon"`, `aria-label="Open navigation"`
  - `Menu` icon from lucide-react
- **Nav icon buttons** (below hamburger) — same icons as `NavigationMenu.tsx`:
  - New Chat → `Plus` icon → `href="/"`, `aria-label="New Chat"`
  - Import → `Database` icon → `href="/import"`, `aria-label="Import"`
  - Discover → `Compass` icon → `href="/discover"`, `aria-label="Discover"`
  - Memory → `History` icon → `href="/history"`, `aria-label="Memory"`
- Each button wrapped in a Radix UI `Tooltip` (from `src/components/ui/tooltip.tsx`) showing the route label
- Active state: `text-blue-600` (consistent with existing `Navbar` button style)
- All buttons: `variant="ghost" size="icon"`
- Use `usePathname()` from next/navigation for active detection

### 3. `src/components/ui/sheet.tsx`
- In `SheetOverlay`: **replace** `bg-black/80` with `backdrop-blur-sm bg-black/40`

### 4. `src/components/layouts/PageHeader.tsx`
- Add `md:hidden` to the sidebar toggle `Button`
- `PageHeader` is confirmed to have no current consumers — this is future-proofing only

### 5. `src/app/(main)/layout.tsx`
- `NavigationShell.tsx` is **not modified** — it renders its `{children}` verbatim
- Change what is passed as children to `NavigationShell` in `layout.tsx`:
  ```tsx
  <NavigationShell>
    <SideNavStrip />
    <div className="flex flex-col min-h-dvh md:pl-10">
      <Navbar />
      {children}
      <BottomNavbar />
    </div>
  </NavigationShell>
  ```
- `SideNavStrip` is `fixed` so it does not affect document flow
- `md:pl-10` (40px) on the content column offsets content from the strip — **this value must equal the strip width (`w-10` = 40px)**; keep them in sync if either changes

### 6. `src/app/(main)/page.tsx`
- **Co-dependent with File 1** (`Navbar.tsx`)
- Replace `md:h-[calc(100dvh-4rem)]` with `md:h-dvh` (no top bar on desktop)
- Mobile branches intentionally unchanged — `Navbar` still renders on mobile so the `4rem` subtraction remains correct:
  - Keyboard open: `h-[calc(100dvh-4rem)]`
  - Keyboard closed: `h-[calc(100dvh-4rem-var(--bottom-navbar-height))]`

## Layout Diagram

```
Desktop (md+):
┌────────────────────────────────────────────┐
│ ☰   │                                      │
│ ➕  │     Main content (children)          │
│ 💾  │     ← md:pl-10 offsets content       │
│ 🧭  │                                      │
│ 🕐  │                                      │
│ 40px│                                      │
└────────────────────────────────────────────┘

Desktop — sidebar open (Sheet at z-50, strip at z-10):
┌────────────────────────────────────────────┐
│ ┌──────────────┐░░░░░░░░░░░░░░░░░░░░░░░░  │
│ │ Logo         │░ backdrop-blur bg-black/40│
│ │ Nav links    │░░░░░░░░░░░░░░░░░░░░░░░░  │
│ │ Chat history │░░░░░░░░░░░░░░░░░░░░░░░░  │
│ └──────────────┘░░░░░░░░░░░░░░░░░░░░░░░░  │
└────────────────────────────────────────────┘

Mobile:
┌──────────────────┐
│ ☰  (top Navbar)  │
├──────────────────┤
│   children       │
├──────────────────┤
│ 🏠  📥  🧭  🕐   │ ← BottomNavbar
└──────────────────┘
```

## Out of Scope
- Changes to `BottomNavbar` content or behavior
- Changes to `NavigationShell.tsx` (sidebar content, width, or Sheet setup)
- Sub-pages under `/discover` — confirmed no height calc dependencies on the top navbar
