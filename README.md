# Cine School Platform

Professional frontend for the Cine School online platform - an alternative film education platform focused on experimental cinema, consciousness, mysticism, AI, and non-conventional techniques.

## Tech Stack

- **Next.js 16.0.6** (App Router, React 19)
- **TypeScript**
- **Tailwind CSS v3.4** (Production-ready)
- **Headless UI** (Accessible component primitives)
- **Framer Motion** (Animations and micro-interactions)
- **NextAuth.js** (Authentication structure)
- **next-themes** (Dark/light mode support)

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

3.  **Build for production**:
    ```bash
    npm run build
    ```

4.  **Run linter**:
    ```bash
    npm run lint
    ```

## Project Structure

```
src/
├── app/
│   ├── (guest)/           # Public routes (login, register, etc.)
│   ├── (auth)/            # Protected routes (dashboard, catalog, etc.)
│   ├── api/auth/          # NextAuth API routes
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Global styles & Tailwind directives
├── components/
│   ├── layout/            # Global layout components (Navbar, Footer)
│   └── providers/         # Context providers (Auth, Theme)
└── lib/
    ├── utils.ts           # Utility functions (cn helper)
    └── api.ts             # Strapi API client
```

## UI Components

The project uses a custom component approach:

- **Tailwind CSS v3** for utility-first styling
- **Headless UI** for accessible, unstyled components (Menu, Dialog, etc.)
- **Framer Motion** for animations and transitions
- **Custom Components** built with these primitives for full design control

### Creating New Components

Components should follow these principles:

1. **Use Tailwind utilities** for styling
2. **Leverage Headless UI** for complex interactions (dropdowns, modals, etc.)
3. **Add Framer Motion** for animations when appropriate
4. **Keep them accessible** (semantic HTML, ARIA attributes)
5. **Make them responsive** (mobile-first approach)

Example component structure:
```tsx
"use client"

import { Menu } from '@headlessui/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function MyComponent() {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
        Open Menu
      </Menu.Button>
      <Menu.Items className="absolute mt-2 w-48 rounded-md bg-card border border-border shadow-lg">
        {/* Items */}
      </Menu.Items>
    </Menu>
  )
}
```

## Styling Guidelines

### Color Tokens

Use semantic color tokens defined in `globals.css`:

- `bg-background` / `text-foreground`
- `bg-primary` / `text-primary-foreground`
- `bg-secondary` / `text-secondary-foreground`
- `bg-muted` / `text-muted-foreground`
- `bg-accent` / `text-accent-foreground`
- `bg-card` / `text-card-foreground`
- `bg-destructive` / `text-destructive-foreground`
- `border-border`, `ring-ring`

### Typography

The project uses **Poppins** as the primary font, loaded via `next/font/google`.

### Dark Mode

Dark mode is supported via `next-themes`. Toggle classes are automatically applied.

## API Integration

Connect to Strapi backend by updating the base URL in `src/lib/api.ts`:

```typescript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
```

## Authentication

NextAuth is configured with a basic structure. To add providers:

1. Edit `src/app/api/auth/[...nextauth]/route.ts`
2. Add OAuth providers (Google, Facebook, etc.)
3. Configure environment variables

## Testing

Testing infrastructure to be added. Recommended:

- **Vitest** for unit tests
- **Playwright** or **Cypress** for E2E tests
- **React Testing Library** for component tests

## Adding New Pages

1. Create route in `src/app/(guest)` or `src/app/(auth)`
2. Use Server Components by default
3. Add `"use client"` only when needed (hooks, events, etc.)
4. Follow responsive design patterns
5. Document in this README

## Documentation

- [AI Agent Guidelines](./agents.md) - How AI should work with this codebase
- [Project Context](./PROJECT_CONTEXT.md) - Vision, features, and roadmap

## Scripts

- `npm run dev` - Start development server (Turbopack enabled)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

When adding new features:

1. Follow the established patterns
2. Keep components accessible
3. Write responsive styles (mobile-first)
4. Test on multiple screen sizes
5. Update this README if needed
