import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        parent: true,
        subscriptions: true,
        registrations: {
          include: {
            class: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
