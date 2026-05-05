# Task Processing Workflow

Follow this workflow for every task received to ensure consistency and quality.

## Phase 1: Task Triage & Analysis
1. **Categorize**: Determine if the task is **Frontend (FE)**, **Backend (BE)**, or **Fullstack**.
   - **FE**: UI changes, form validation, client-side state, styling.
   - **BE**: Prisma schema, API route handlers, business logic, DB queries.
2. **Impact Assessment**: Identify which existing files are affected.
3. **Plan**: Outline the changes in a brief implementation plan before coding.

## Phase 2: Implementation Guidelines
- **Backend (BE)**:
  - If DB changes: Update `prisma/schema.prisma` -> `npx prisma generate`.
  - Routes: Implement/Update handlers in `src/app/api/...`.
  - **RESTful Check**: Ensure status codes (200, 201, 400, 404, 500) match the action.
- **Frontend (FE)**:
  - Components: Update files in `src/components/...`.
  - Pages: Update files in `src/app/.../page.tsx`.
  - **Styling**: Use Tailwind CSS with a premium aesthetic (vibrant colors, smooth transitions).

## Phase 3: Post-Change Verification
After *every* non-trivial change, you MUST verify the following:

1. **Lint Check**: Run `npm run lint` to ensure no styling or syntax errors.
2. **Type Check**: Run `npx tsc --noEmit` to verify TypeScript integrity.
3. **API Consistency**:
   - Check against `.agent/rules/api-pattern.md`.
   - Ensure `request` body is validated.
   - Ensure errors are caught and logged.
4. **Build Check**: If requested or if the change is structural, run `npm run build`.

## Phase 4: API Quality Checklist
Every API endpoint must pass this check:
- [ ] Uses `NextResponse.json()`.
- [ ] Correct HTTP Method (GET, POST, PATCH, DELETE).
- [ ] Returns meaningful error messages on failure.
- [ ] Follows the path naming convention: `/api/[resource]` or `/api/[resource]/[id]`.
- [ ] (Next.js 15/16+) `params` is awaited if it's a Promise.
