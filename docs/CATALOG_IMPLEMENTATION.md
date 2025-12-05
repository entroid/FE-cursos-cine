# Catalog Implementation Guide

## Overview
The Catalog page (`/catalog`) displays all available courses, allowing users to filter by tags, levels, and search by title. It is implemented as a **Server Component** for SEO and performance, with interactive Client Components for filtering.

## Architecture

### Page Structure (`src/app/(auth)/catalog/page.tsx`)
- **Server Component**: Fetches initial data (courses, tags) on the server.
- **URL-Driven State**: Uses URL search params (`?q=`, `?tag=`, `?level=`) to manage state, making the page shareable and bookmarkable.
- **Suspense Boundaries**: Wraps `CourseGrid` and `FiltersSection` to show skeletons while data loads.

### Components
1. **`CourseCard`** (`src/components/catalog/course-card.tsx`)
   - Displays course thumbnail, title, instructor, price, and metadata.
   - Uses `unoptimized` prop on Next.js `Image` to handle Strapi images without validation errors.
   - Includes `CourseCardSkeleton` for loading states.

2. **`SearchBar`** (`src/components/catalog/search-bar.tsx`)
   - **Client Component**.
   - Implements **debounced search** (300ms delay).
   - Updates URL parameters on key release (after 2 characters).
   - Uses `useTransition` for smooth UI updates.

## Data Fetching (`src/lib/strapi.ts`)

### `getPublishedCourses()`
Fetches courses from Strapi with the following logic:

1. **Populate Strategy**:
   - Uses `populate=*` instead of nested bracket syntax (`populate[instructor][populate]=avatar`) to ensure compatibility with Strapi v5.
   - Strapi v5 can return 400 Bad Request errors with complex nested populates on some endpoints.

2. **Filtering Strategy**:
   - **Client-side Filtering**: We filter `settings.visible` and `featured` in the application code, not the API query.
   - **Reason**: Filtering by component fields (like `settings.visible`) in Strapi v5 can be unreliable or require specific plugin configurations.
   - **Search**: Title search is also performed client-side in the `CourseGrid` component to ensure instant feedback and avoid complex API filtering syntax.

### Type Definitions (`src/types/course.ts`)
- **`Course`**: Full Strapi entity structure.
- **`CatalogCourse`**: simplified interface for UI display.
- **`toCatalogCourse()`**: Helper function that transforms raw API data into UI-ready data, providing defensive defaults for missing fields (e.g., `estimatedDuration: 0` if null).

## Configuration

### Image Domains (`next.config.ts`)
To display images from the local Strapi instance, the domain must be whitelisted:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "http",
      hostname: "localhost",
      port: "1337",
      pathname: "/uploads/**",
    },
  ],
},
```

## Common Issues & Solutions

### "Application error: a client-side exception has occurred"
- **Cause**: Usually `undefined` fields in the Strapi response (e.g., `estimatedDuration` is null).
- **Fix**: The `toCatalogCourse` transformer now applies default values (e.g., `|| 0`, `|| ""`) to all optional fields.

### Images not loading / "url parameter is not allowed"
- **Cause**: Next.js Image Optimization trying to optimize external/local images without proper config.
- **Fix**: Added `unoptimized` prop to `Image` components for Strapi assets.

### Hydration Mismatch
- **Cause**: Font variables or class names differing between server and client.
- **Fix**: Added `suppressHydrationWarning` to the `<body>` tag in `layout.tsx`.
