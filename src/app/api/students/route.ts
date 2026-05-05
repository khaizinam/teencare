import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, dob, gender, currentGrade, parentId } = body

    if (!name || !dob || !gender || !currentGrade || !parentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const student = await prisma.student.create({
      data: {
        name,
        dob: new Date(dob),
        gender,
        currentGrade: parseInt(currentGrade),
        parentId,
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        parent: true,
        subscriptions: { orderBy: { createdAt: 'desc' } },
        registrations: { include: { class: true }, orderBy: { scheduledDate: 'desc' } }
      },
    })
    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
