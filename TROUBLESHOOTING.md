# Course Page Troubleshooting Guide

## Issue: "Failed to fetch course" Error

### Root Causes to Check

#### 1. **Environment Variable Not Set**
The most common cause is that `NEXT_PUBLIC_STRAPI_URL` is not configured.

**Solution:**
Create or update `.env.local` in the project root:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

If using a remote Strapi instance:
```env
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com
```

#### 2. **Strapi Server Not Running**
Verify your Strapi backend is running and accessible.

**Check:**
```bash
# Test the API endpoint directly
curl http://localhost:1337/api/courses
```

#### 3. **Course Slug Doesn't Exist**
The slug in the URL might not match any course in Strapi.

**Check in Strapi:**
- Go to Strapi admin panel
- Navigate to Courses
- Verify the course slug matches the URL parameter
- Ensure the course is published/visible

#### 4. **API Response Format Issue**
The Strapi API might be returning an unexpected format.

**Debug Steps:**
1. Check the browser's Network tab (DevTools)
2. Look at the actual API response from:
   ```
   http://localhost:1337/api/courses?filters[slug][$eq]=your-course-slug&populate=deep
   ```
3. Verify the response has the structure:
   ```json
   {
     "data": [
       {
         "id": 1,
         "title": "Course Title",
         "slug": "course-slug",
         ...
       }
     ]
   }
   ```

#### 5. **CORS Issues**
If Strapi is on a different domain, CORS might be blocking the request.

**Check Strapi Configuration:**
In `config/middlewares.js`, ensure CORS is properly configured:
```javascript
module.exports = [
  'strapi::cors',
  // ... other middleware
];
```

### How to Debug

The improved error logging now shows:
1. **HTTP Status Code** - tells you if it's a 404, 500, etc.
2. **Response Body** - shows the actual error from Strapi
3. **Slug Being Requested** - confirms what slug is being searched

**Check Next.js Console Output:**
```
Strapi error (404) fetching course "my-course-slug":
{"data":[],"meta":{...}}
```

### Common Error Codes

| Status | Meaning | Solution |
|--------|---------|----------|
| 404 | Not Found | Course slug doesn't exist in Strapi |
| 500 | Server Error | Strapi backend error - check Strapi logs |
| ECONNREFUSED | Connection Refused | Strapi server not running |
| CORS Error | Cross-Origin | Strapi CORS configuration issue |

### Quick Test

1. **Verify Strapi is running:**
   ```bash
   curl http://localhost:1337/api/courses
   ```

2. **Check a specific course:**
   ```bash
   curl "http://localhost:1337/api/courses?filters[slug][$eq]=test-course&populate=deep"
   ```

3. **Check environment variable:**
   ```bash
   echo $NEXT_PUBLIC_STRAPI_URL
   ```

### Still Having Issues?

1. Check Next.js console for detailed error messages
2. Check Strapi server logs for API errors
3. Verify the course exists in Strapi admin panel
4. Ensure the course slug is correct and matches the URL
5. Try accessing the Strapi API directly in your browser
