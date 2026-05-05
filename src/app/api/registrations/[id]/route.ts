import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const registration = await prisma.classRegistration.findUnique({
      where: { id },
      include: {
        class: true,
        student: {
          include: {
            subscriptions: {
              where: {
                endDate: { gte: new Date() }
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        }
      }
    })

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    // Calculate class start time
    // timeSlot format: "08:00-10:00"
    const startTimeStr = registration.class.timeSlot.split('-')[0]
    const [hours, minutes] = startTimeStr.split(':').map(Number)
    
    const classStartTime = new Date(registration.scheduledDate)
    classStartTime.setHours(hours, minutes, 0, 0)

    const now = new Date()
    const diffInMs = classStartTime.getTime() - now.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)

    const shouldRefund = diffInHours > 24

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Delete registration
      await tx.classRegistration.delete({
        where: { id }
      })

      // Refund if > 24h
      if (shouldRefund && registration.student.subscriptions.length > 0) {
        const sub = registration.student.subscriptions[0]
        if (sub.usedSessions > 0) {
          await tx.subscription.update({
            where: { id: sub.id },
            data: {
              usedSessions: { decrement: 1 }
            }
          })
        }
      }
    })

    return NextResponse.json({ 
      message: 'Registration cancelled', 
      refunded: shouldRefund 
    })
  } catch (error) {
    console.error('Cancellation error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
