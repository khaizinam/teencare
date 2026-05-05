import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, subject, dayOfWeek, timeSlot, teacherName, maxStudents } = body

    if (!name || subject === undefined || dayOfWeek === undefined || !timeSlot || !teacherName || !maxStudents) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        subject,
        dayOfWeek: parseInt(dayOfWeek),
        timeSlot,
        teacherName,
        maxStudents: parseInt(maxStudents),
      },
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const day = searchParams.get('day')

    const where = day ? { dayOfWeek: parseInt(day) } : {}

    const classes = await prisma.class.findMany({
      where,
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    })
    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
