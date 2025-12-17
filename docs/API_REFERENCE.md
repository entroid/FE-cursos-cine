# Strapi API Reference

## Base URL
```
${STRAPI_URL}/api
```
> Default local: `http://localhost:1337/api`

---

## Authentication

### Login
```http
POST /api/auth/local
Content-Type: application/json

{
  "identifier": "user@email.com",
  "password": "password123"
}
```

**Response:** `{ "jwt": "...", "user": {...} }`

### Register
```http
POST /api/auth/local/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "user@email.com",
  "password": "password123"
}
```

---

## Users

### Get User by Email (Server-side)
```http
GET /api/users?filters[email][$eq]=user@email.com
Authorization: Bearer {API_TOKEN}
```
> **Note:** This endpoint uses Strapi API Token, not user JWT. Called from Next.js backend.
> **Strapi v5 Update:** Endpoint changed from `/api/users/me?email=...` to use proper filter syntax.

**Response Structure:**
```json
// Strapi v5 (direct array)
[
  {
    "id": 1,
    "username": "johndoe",
    "email": "user@email.com",
    "displayName": "John Doe",
    "avatar": {...},
    "courses": [...]
  }
]

// Strapi v4 (wrapped in data)
{
  "data": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "user@email.com",
      "displayName": "John Doe",
      "avatar": {...},
      "courses": [...]
    }
  ]
}
```

---

## Courses

### List Courses (Public)
```http
GET /api/courses?populate=*
```
> **Note (Strapi v5):** Use `populate=*` for best compatibility. Filtering by component fields (e.g., `settings.visible`) may require client-side filtering if API returns 400 errors.

### Get Single Course
```http
GET /api/courses/{id}?populate=deep
```

**Schema:**
| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Course title (required) |
| `slug` | UID | URL-friendly identifier |
| `coverImage` | Media | Course thumbnail |
| `urlPresentacion` | String | Course presentation video URL (YouTube, Vimeo, etc.) |
| `shortDescription` | Text | Max 200 chars |
| `fullDescription` | Richtext | Full HTML description |
| `instructor` | Relation | Instructor reference |
| `level` | Enum | `beginner`, `intermediate`, `advanced` |
| `estimatedDuration` | Integer | Total minutes (auto-calculated) |
| `priceUsd` | Integer | Price in USD cents |
| `priceArg` | Integer | Price in ARS (required) |
| `tags` | Relation | Many-to-many with Tags |
| `modules` | Component[] | Course modules with lessons |
| `settings` | Component | Course settings (see below) |

**Settings Component (course.settings):**
| Field | Type | Description |
|-------|------|-------------|
| `visible` | Boolean | Show in public listings (default: true) |
| `featured` | Boolean | Highlight as featured course (default: false) |
| `language` | Enum | `es`, `en`, `pt` (default: es) |
| `releaseDate` | DateTime | Scheduled release date |
| `seo` | Component | SEO metadata (title, description, keywords) |

---

## Instructors

### List Instructors (Public)
```http
GET /api/instructors?populate=*
```

**Schema:**
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Instructor name (required) |
| `slug` | UID | URL identifier |
| `bio` | Richtext | Biography |
| `avatar` | Media | Profile image |
| `email` | Email | Contact email |
| `socialLinks` | Component[] | Social media links |
| `courses` | Relation | Instructor's courses |

---

## Tags

### List Tags
```http
GET /api/tags
```

**Schema:**
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Tag name (unique) |
| `slug` | UID | URL identifier |
| `description` | Text | Tag description |
| `color` | String | Hex color code |

---

## Enrollments (Auth Required)

### List User's Enrollments
```http
GET /api/enrollments
Authorization: Bearer {jwt}
```

### Update Progress
```http
PUT /api/enrollments/{id}
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "data": {
    "id": 123,
    "currentLesson": "lesson-slug",
    "completedLessons": ["lesson-1", "lesson-2"],
    "lastAccessedAt": "2025-12-11T19:00:00.000Z"
  }
}
```
> **Strapi v5 Requirement:** Must include `id` field inside `data` object along with URL ID.
> Auto-calculates: `progressPercentage`, `enrollmentStatus`, `completedAt`

### Continue Watching
```http
GET /api/enrollments/continue-watching
Authorization: Bearer {jwt}
```

Returns most recent active enrollment or `{ "data": null }`.

### Validate Access (Server-side)
```http
GET /api/enrollments?filters[course][id][$eq]={courseId}&filters[user][id][$eq]={userId}
Authorization: Bearer {user_jwt} OR {API_TOKEN}
```
> **Note:** Prefer user JWT token over API Token for enrollment access. Called from Next.js backend to validate course access.
> **Implementation:** Returns `true` if user has at least one enrollment for the course (any status).
> **Authentication:** Uses user's JWT token from session (`session.strapiToken`) when available, falls back to API Token.

**Enrollment Schema:**
| Field | Type | Description |
|-------|------|-------------|
| `user` | Relation | User reference |
| `course` | Relation | Course reference |
| `enrollmentStatus` | Enum | `not-started`, `in-progress`, `completed` |
| `progressPercentage` | Decimal | 0-100 |
| `currentLesson` | String | Current lessonId slug |
| `completedLessons` | JSON | Array of lessonId slugs |
| `enrolledAt` | DateTime | Enrollment date |
| `lastAccessedAt` | DateTime | Last activity |
| `completedAt` | DateTime | Completion date |
| `paymentProvider` | Enum | `stripe`, `mercadopago`, `free` |
| `paymentId` | String | Payment reference |
| `expiresAt` | DateTime | Access expiration |

---

## Components

### Lesson (course.lesson)
| Field | Type | Description |
|-------|------|-------------|
| `lessonId` | String | Auto-generated slug (read-only) |
| `title` | String | Lesson title (required) |
| `videoUrl` | String | Video URL |
| `textContent` | Richtext | Lesson content |
| `duration` | Integer | Duration in minutes |
| `freePreview` | Boolean | Free preview enabled |
| `order` | Integer | Display order |

---

## Strapi v5 Compatibility Notes

### Authentication Flow Updates

**Issue Resolution History:**
1. **403 Forbidden Error**: Fixed invalid API endpoint `/api/users/me?email=...` → `/api/users?filters[email][$eq]=...`
2. **User Not Found Error**: Fixed response structure handling for Strapi v5 (direct array vs wrapped in `data` property)
3. **404 Validate Access Error**: Fixed missing `/api/enrollments/validate-access` endpoint → use standard `/api/enrollments` with filters
4. **401 Unauthorized Error**: Fixed authentication by using user JWT token (`session.strapiToken`) instead of API Token for enrollment access
5. **400 Invalid Enrollment ID**: Fixed Strapi v5 PUT format by including `id` field inside `data` object for enrollment updates

**Environment Variables Required:**
```env
STRAPI_API_TOKEN=your_strapi_api_token_here
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

**Response Structure Changes:**
- **Strapi v4**: `{ "data": [users] }`
- **Strapi v5**: `[users]` (direct array)

**Implementation Details:**
- Updated `getStrapiUser()` function in `src/lib/strapi.ts` to handle both response formats
- Added compatibility layer: `const users = Array.isArray(data) ? data : (data.data || [])`
- Fixed missing `EnrollmentAttributes` import in strapi utilities
- Updated `useCourseProgress` hook to call Strapi directly with correct v5 payload format
- Modified `UpdateProgressData` type to include optional `id` field
- Removed internal API proxy for enrollment updates to ensure correct Strapi v5 format

### NextAuth Integration

**JWT Callback Flow:**
```typescript
// In src/app/api/auth/[...nextauth]/route.ts
async jwt({ token, user, account }) {
  // Refresh Strapi user data using API Token (server-side)
  if (token.email && process.env.STRAPI_API_TOKEN) {
    try {
      const strapiUser = await getStrapiUser(token.email);
      token.strapiUser = strapiUser;
    } catch (error) {
      console.error("Error fetching Strapi user:", error);
    }
  }
  return token;
}
```

**Common Error Patterns:**
- **403 Forbidden**: Missing or invalid `STRAPI_API_TOKEN`
- **User Not Found**: Incorrect API endpoint or response structure handling
- **TypeScript Errors**: Missing imports for type definitions
- **400 Invalid Enrollment ID**: Missing `id` field in `data` object for Strapi v5 PUT requests

---

## Notes

> [!IMPORTANT]
> **enrollmentStatus:** Field is named `enrollmentStatus` (not `status`) due to PostgreSQL.

> [!NOTE]
> **lessonId:** Auto-generated from title. Use for `currentLesson` and `completedLessons`.
