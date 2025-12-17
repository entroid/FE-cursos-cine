# AI Agent Guidelines

## Project Context

"Escuela de Cine" is an online platform for alternative film education, focusing on experimental cinema, consciousness, mysticism, AI, and non-conventional techniques. The platform aims to provide a premium, immersive learning experience with a minimalist "cine editorial" aesthetic.

## Tech Stack

### Core
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Runtime**: React 19

### Styling & UI
- **CSS Framework**: Tailwind CSS v3.4 (production-ready, stable)
- **Component Primitives**: Headless UI (accessible, unstyled components)
- **Animations**: Framer Motion (micro-interactions, transitions)
- **Typography**: Poppins (Google Fonts)
- **Theme**: next-themes (dark/light mode)

### Backend & Auth
- **CMS**: Strapi (headless CMS)
- **Auth**: NextAuth (OAuth structure prepared)
- **API Client**: Custom fetch wrapper (`lib/api.ts`)

### Tooling
- **Linting**: ESLint + Prettier
- **Build**: Next.js (Turbopack for dev, optimized for production)

## Code Conventions

### Imports
- Use `@/` alias for `src/` directory
- Group imports: React → Third-party → Local
- Use named imports when possible

### Component Structure
- **Default to Server Components** for better performance
- Use `"use client"` directive only when necessary:
  - Using React hooks (useState, useEffect, etc.)
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs
  - Third-party libraries that require client-side rendering

### Styling Guidelines
1. **Use Tailwind utilities** for all styling
2. **Semantic color tokens**: Use `bg-primary`, `text-foreground`, etc.
3. **Responsive design**: Mobile-first, test on all breakpoints
4. **Dark mode ready**: All colors adapt automatically via CSS variables

### UI Component Patterns

#### Simple Components (Tailwind only)
```tsx
export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
      {children}
    </button>
  )
}
```

#### Interactive Components (Headless UI)
```tsx
"use client"

import { Menu } from '@headlessui/react'

export function Dropdown() {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="px-4 py-2 rounded-md border border-input">
        Options
      </Menu.Button>
      <Menu.Items className="absolute mt-2 w-48 bg-card border border-border rounded-md shadow-lg">
        <Menu.Item>
          {({ active }) => (
            <a className={active ? 'bg-accent' : ''}>
              Item
            </a>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
```

#### Animated Components (Framer Motion)
```tsx
"use client"

import { motion } from 'framer-motion'

export function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-card rounded-xl border border-border"
    >
      Content
    </motion.div>
  )
}
```

## Architecture

### Route Groups
- `(guest)`: Public routes (login, register) - no authentication required
- `(auth)`: Protected routes (dashboard, catalog, profile) - requires authentication

### Global Providers
Configured in `src/app/layout.tsx`:
1. **AuthProvider**: NextAuth session management
2. **ThemeProvider**: Dark/light mode switching

### API Integration
- Base URL: Configured via `NEXT_PUBLIC_STRAPI_URL` environment variable
- Client: `src/lib/api.ts` - Reusable fetch wrapper
- Error handling: Built-in error logging and user-friendly messages

## Design System

- Use squared CTAs and form inputs
- Border CTAs with transparent background. Hover: filled background with border color.

### Colors
Semantic tokens defined in `globals.css`:
- **background/foreground**: Page base colors
- **primary**: Main brand color, general CTAs
- **secondary**: Secondary actions
- **muted**: Subtle backgrounds, disabled states
- **accent**: Highlights, hover states, main CTAs
- **destructive**: Errors, dangerous actions
- **border/input/ring**: UI element boundaries and focus states

### Typography
- **Font**: Poppins (400, 500, 600, 700 weights)
- **Hierarchy**: Use Tailwind's text size utilities
- **Line height**: Default to Tailwind's leading utilities

### Spacing
- Follow 4px grid (0.5, 1, 2, 4, 6, 8, etc.)
- Use consistent spacing between sections

## Development Workflow

### When Adding Features
1. **Analyze requirements** - Understand the user story
2. **Check existing patterns** - Reuse components and utilities
3. **Server-first approach** - Default to Server Components
4. **Implement with tests** - Unit tests for complex logic
5. **Verify responsive** - Test on mobile, tablet, desktop

### Component Creation
1. Determine if client or server component
2. Use Headless UI for complex interactions (menus, dialogs, transitions)
3. Add Framer Motion for animations when appropriate
4. Ensure accessibility (ARIA labels, keyboard navigation)
5. Make it responsive (mobile-first)

### Styling Approach
1. Start with Tailwind utilities
2. Use semantic color tokens (not hardcoded colors)
3. Ensure dark mode compatibility
4. Add hover/focus states
5. Test on all breakpoints

## Testing Strategy
(To be implemented)
- **Unit**: Vitest + React Testing Library
- **E2E**: Playwright or Cypress
- **Component**: Storybook (optional)

## Common Tasks

### Adding a New Page
1. Create file in appropriate route group: `src/app/(guest)/new-page/page.tsx`
2. Use Server Component by default
3. Add page metadata with `export const metadata`
4. Follow responsive design patterns

### Adding Authentication
1. Configure providers in `src/app/api/auth/[...nextauth]/route.ts`
2. Add environment variables for OAuth credentials
3. Use `useSession()` hook (client-side) or `getServerSession()` (server-side)

### Connecting to Strapi
1. Set `NEXT_PUBLIC_STRAPI_URL` in `.env.local`
2. Use `fetchAPI()` from `src/lib/api.ts`
3. Handle loading and error states
4. Type your data with TypeScript interfaces

## Best Practices

### Performance
- Prefer Server Components
- Use dynamic imports for heavy client components
- Optimize images with `next/image`
- Implement loading states

### Accessibility
- Use semantic HTML
- Add ARIA attributes where needed
- Ensure keyboard navigation
- Test with screen readers

### SEO
- Add proper metadata to pages
- Use semantic headings (h1, h2, etc.)
- Implement structured data when relevant

## Error Handling
- Show user-friendly messages
- Log errors to console in development
- Consider error boundaries for critical sections

## When Working with This Codebase
1. Always check the implementation plan before major changes
2. Follow the established patterns and conventions
3. Update this file when introducing new patterns
4. Test your changes thoroughly
5. Ensure backward compatibility
