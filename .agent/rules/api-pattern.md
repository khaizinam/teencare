# API Pattern Rules

All API Route Handlers in this project MUST follow these patterns:

## 1. Directory Structure
- Follow Next.js App Router conventions: `src/app/api/[resource]/route.ts`.
- Use dynamic routes for ID-based operations: `src/app/api/[resource]/[id]/route.ts`.

## 2. Response Format
- Always return a `NextResponse.json()`.
- Success responses should return the data directly or a message.
- Error responses MUST include an `error` field and an appropriate HTTP status code.
  - 400: Validation/Missing fields
  - 401: Unauthorized
  - 403: Forbidden (e.g. no subscription)
  - 404: Resource not found
  - 500: Internal Server Error

## 3. Error Handling
- Wrap the handler logic in a `try...catch` block.
- Log errors to `console.error` for debugging in the container logs.
- Never expose raw database errors to the client.

## 4. Prisma Usage
- Use the singleton Prisma client from `@/lib/prisma`.
- Use transactions (`prisma.$transaction`) for operations that modify multiple records (e.g. registration + session decrement).

## 5. Input Validation
- Always check for required fields at the beginning of the POST/PATCH handlers.
- Parse and validate types (e.g. `parseInt`, `new Date()`) before passing to Prisma.

## 6. Dynamic Routes (Next.js 15+)
- The `params` object in dynamic routes is a **Promise** and MUST be awaited before use.
- Correct signature: `export async function GET(request: Request, { params }: { params: Promise<{ id: string }> })`.

## Example
```typescript
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
    
    const result = await prisma.resource.create({ data: body })
    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```
