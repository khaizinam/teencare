import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { studentId, packageName, totalSessions, endDate } = body

    if (!studentId || !packageName || !totalSessions || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const subscription = await prisma.subscription.create({
      data: {
        studentId,
        packageName,
        totalSessions: parseInt(totalSessions),
        endDate: new Date(endDate),
      },
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
