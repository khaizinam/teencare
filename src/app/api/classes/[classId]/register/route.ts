import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function POST(
  request: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const body = await request.json()
    const { studentId, scheduledDate } = body

    if (!studentId || !scheduledDate) {
      return NextResponse.json({ error: 'Missing studentId or scheduledDate' }, { status: 400 })
    }

    const classId = params.classId
    const targetDate = new Date(scheduledDate)

    // 1. Get Class info
    const targetClass = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        _count: {
          select: { registrations: { where: { scheduledDate: targetDate } } }
        }
      }
    })

    if (!targetClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    // 2. Check Max Students
    if (targetClass._count.registrations >= targetClass.maxStudents) {
      return NextResponse.json({ error: 'Class is full' }, { status: 400 })
    }

    // 3. Check Subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        studentId,
        endDate: { gte: new Date() },
        usedSessions: { lt: prisma.subscription.fields.totalSessions }
      }
    })

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription or no sessions left' }, { status: 403 })
    }

    // 4. Check Overlapping Schedule
    // A student cannot have two classes at the same time on the same day.
    const overlap = await prisma.classRegistration.findFirst({
      where: {
        studentId,
        scheduledDate: targetDate,
        class: {
          timeSlot: targetClass.timeSlot
        }
      }
    })

    if (overlap) {
      return NextResponse.json({ error: 'Schedule overlap detected' }, { status: 400 })
    }

    // 5. Create Registration & Consume Session
    const registration = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const reg = await tx.classRegistration.create({
        data: {
          classId,
          studentId,
          scheduledDate: targetDate,
        }
      })

      await tx.subscription.update({
        where: { id: subscription.id },
        data: {
          usedSessions: { increment: 1 }
        }
      })

      return reg
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
