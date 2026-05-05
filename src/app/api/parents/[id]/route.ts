import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const parent = await prisma.parent.findUnique({
      where: { id },
      include: {
        students: true
      }
    })

    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    return NextResponse.json(parent)
  } catch (error) {
    console.error('Error fetching parent:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
