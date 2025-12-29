# Component Inventory - Prompt Alchemist

**Generated:** 2025-12-21  
**Total Components:** 5 (excluding tests)  
**UI Library:** ShadCN UI (Radix UI + Tailwind CSS)

---

## Overview

This project uses **ShadCN UI** components - a collection of accessible, customizable components built on Radix UI primitives and styled with Tailwind CSS. Components are located in `src/components/` and follow the ShadCN pattern of being copied into the project (not installed as dependencies).

---

## Component Categories

### Application Components (1)

Components specific to this application's functionality.

#### AppErrorBoundary
- **File:** `src/components/AppErrorBoundary.tsx`
- **Type:** Error Boundary (Class Component)
- **Purpose:** Catches React errors and displays fallback UI
- **Props:**
  - `children: React.ReactNode` - Child components to monitor
  - `fallback?: React.ReactNode | ((error: Error) => React.ReactNode)` - Custom error UI
- **Features:**
  - Logs errors via `@/lib/logger`
  - Default fallback UI with Card component
  - Shows error details in dev mode
  - "Reload app" button for recovery
- **Dependencies:** Button, Card components
- **Test Coverage:** ✅ `AppErrorBoundary.test.tsx`

---

### UI Components (4)

ShadCN UI components for building interfaces.

#### Button
- **File:** `src/components/ui/button.tsx`
- **Type:** Interactive Element
- **Library:** Radix UI Slot + CVA (Class Variance Authority)
- **Purpose:** Polymorphic button component with multiple variants
- **Variants:**
  - `default` - Primary action button (blue background)
  - `destructive` - Dangerous action (red background)
  - `outline` - Secondary action (bordered)
  - `secondary` - Alternative action (gray background)
  - `ghost` - Minimal button (no background)
  - `link` - Text link style (underlined)
- **Sizes:**
  - `default` - h-9 (standard size)
  - `sm` - h-8 (small)
  - `lg` - h-10 (large)
  - `icon` - size-9 (square icon button)
  - `icon-sm` - size-8 (small icon)
  - `icon-lg` - size-10 (large icon)
- **Features:**
  - Supports `asChild` prop via Radix Slot (polymorphism)
  - Focus ring styles with accessibility
  - Disabled state handling
  - SVG icon support with automatic sizing
  - Invalid state styling (`aria-invalid`)
- **Accessibility:** Full keyboard navigation, ARIA support
- **Styling:** Tailwind CSS with dark mode support

#### Card
- **File:** `src/components/ui/card.tsx`
- **Type:** Container/Layout
- **Purpose:** Container component for grouping related content
- **Sub-components:**
  - `Card` - Main container
  - `CardHeader` - Header section with title/actions
  - `CardTitle` - Heading within header
  - `CardDescription` - Descriptive text in header
  - `CardAction` - Action buttons in header
  - `CardContent` - Main content area
  - `CardFooter` - Footer section for actions
- **Features:**
  - Grid-based header layout (title + actions)
  - Flexible content composition
  - Container query support (`@container`)
  - Data slot attributes for styling hierarchy
  - Border and shadow styling
- **Styling:** Rounded corners, border, shadow-sm
- **Usage:** Error boundaries, content cards, forms

#### Input
- **File:** `src/components/ui/input.tsx`
- **Type:** Form Control
- **Purpose:** Text input field with consistent styling
- **Props:** Extends native `<input>` HTML attributes
- **Features:**
  - Focus ring styles
  - Invalid state styling (`aria-invalid`)
  - File input styling (for `type="file"`)
  - Placeholder text styling
  - Disabled state handling
  - Selection color customization
- **Accessibility:** Native HTML5 input with enhanced ARIA support
- **Styling:**
  - Height: h-9
  - Border with focus states
  - Dark mode support
  - Shadow-xs for depth
- **Validation:** Built-in `aria-invalid` styling for errors

#### Sonner (Toaster)
- **File:** `src/components/ui/sonner.tsx`
- **Type:** Notification/Toast
- **Library:** `sonner` package
- **Purpose:** Display temporary notification messages
- **Features:**
  - Theme integration via `next-themes`
  - Custom icons for each toast type:
    - Success: CircleCheckIcon
    - Info: InfoIcon
    - Warning: TriangleAlertIcon
    - Error: OctagonXIcon
    - Loading: Loader2Icon (animated)
  - CSS variable integration for theming
  - Automatic positioning
  - Dark mode support
- **Toast Types:** success, info, warning, error, loading
- **Styling:** Matches application theme automatically
- **Usage:** Global notifications, feedback messages
- **Test Coverage:** ✅ `sonner.test.tsx`

---

## Component Hierarchy

```
App
├── AppErrorBoundary (wraps entire app)
│   └── [App Content]
│       ├── Card (for error fallback)
│       │   ├── CardHeader
│       │   │   └── CardTitle
│       │   ├── CardContent
│       │   └── CardFooter
│       │       └── Button (reload)
│       └── [Application UI]
│           ├── Button (various interactions)
│           ├── Input (form fields)
│           ├── Card (content containers)
│           └── Toaster (global notifications)
```

---

## Design System

### Styling Approach

**Method:** Tailwind CSS utility classes  
**Customization:** CVA (Class Variance Authority) for variant-based styling  
**Theme:** CSS variables for colors and spacing  
**Dark Mode:** Supported via `next-themes` package

### Common Utilities

All components use `cn()` utility from `@/lib/utils` for className merging:
```typescript
import { cn } from '@/lib/utils';
```

This combines `clsx` and `tailwind-merge` for conflict-free class composition.

---

## Accessibility Features

All UI components follow accessibility best practices:

✅ **Keyboard Navigation:** Full keyboard support  
✅ **Focus Management:** Visible focus rings  
✅ **ARIA Attributes:** Proper ARIA labels and roles  
✅ **Screen Readers:** Semantic HTML elements  
✅ **Invalid States:** `aria-invalid` styling for form errors  
✅ **Disabled States:** Proper disabled attribute handling  

---

## Testing

**Test Framework:** Vitest + React Testing Library

**Tested Components:**
- ✅ AppErrorBoundary (`AppErrorBoundary.test.tsx`)
- ✅ Sonner (`sonner.test.tsx`)

**Untested Components:**
- Button (excluded from coverage in `vite.config.ts`)
- Card (excluded from coverage in `vite.config.ts`)
- Input (excluded from coverage in `vite.config.ts`)

**Coverage Exclusions:** ShadCN UI components are excluded as they're third-party patterns.

---

## Component Patterns

### Composition Pattern

Components support composition via props:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Polymorphism (Button)

Button supports `asChild` for rendering as different elements:

```typescript
<Button asChild>
  <a href="/link">Link Button</a>
</Button>
```

### Variant System

Components use CVA for variant management:

```typescript
<Button variant="destructive" size="lg">
  Delete
</Button>
```

---

## Adding New Components

### ShadCN UI CLI

New ShadCN components can be added via CLI:

```bash
npx shadcn-ui@latest add [component-name]
```

Components are automatically added to `src/components/ui/`.

### Component Configuration

ShadCN config: `components.json`
- Aliases: `@/components`, `@/lib`, `@/utils`
- Style: Tailwind CSS
- TypeScript: Enabled

---

## Dependencies

### Direct Dependencies

- `@radix-ui/react-slot` (^1.2.4) - Polymorphic component support
- `class-variance-authority` (^0.7.1) - Variant-based styling
- `clsx` (^2.1.1) - Conditional classNames
- `tailwind-merge` (^3.4.0) - Tailwind class merging
- `lucide-react` (^0.562.0) - Icon library
- `sonner` (^2.0.7) - Toast notifications
- `next-themes` (^0.4.6) - Theme management

### Peer Dependencies

- `react` (^19.2.3)
- `react-dom` (^19.2.3)
- `tailwindcss` (^4.1.18)

---

## Component Organization

```
src/components/
├── ui/                          # ShadCN UI components
│   ├── button.tsx               # Button component
│   ├── card.tsx                 # Card and sub-components
│   ├── input.tsx                # Input field
│   ├── sonner.tsx               # Toast notifications
│   └── sonner.test.tsx          # Sonner tests
├── AppErrorBoundary.tsx         # Error boundary
└── AppErrorBoundary.test.tsx    # Error boundary tests
```

---

## Future Enhancements

**Potential Components to Add:**

Based on the Prompt Alchemist feature roadmap:

- **Form Components:**
  - Textarea (multi-line text input)
  - Select/Combobox (dropdowns)
  - Checkbox/Radio (selections)
  - Label (form labels)

- **Layout Components:**
  - Dialog/Modal (overlays)
  - Tabs (navigation)
  - Accordion (collapsible sections)
  - Separator (dividers)

- **Data Display:**
  - Table (data tables)
  - Badge (tags/labels)
  - Avatar (user images)
  - Tooltip (hover hints)

- **Navigation:**
  - Navigation Menu
  - Breadcrumb
  - Sidebar/Sheet

---

## Resources

- **ShadCN UI Docs:** https://ui.shadcn.com/
- **Radix UI Docs:** https://www.radix-ui.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **Project Components:** `src/components/`

---

_This component inventory was generated by analyzing the codebase structure and component implementations._
