import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email } = body

    if (!name || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const parent = await prisma.parent.create({
      data: {
        name,
        phone,
        email,
      },
    })

    return NextResponse.json(parent, { status: 201 })
  } catch (error) {
    console.error('Error creating parent:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const parents = await prisma.parent.findMany({
      include: {
        students: true,
      },
    })
    return NextResponse.json(parents)
  } catch (error) {
    console.error('Error fetching parents:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
