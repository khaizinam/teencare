import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id }
    })

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    if (subscription.usedSessions >= subscription.totalSessions) {
      return NextResponse.json({ error: 'No sessions remaining' }, { status: 400 })
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        usedSessions: {
          increment: 1
        }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error using subscription session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
