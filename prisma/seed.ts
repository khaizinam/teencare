import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean the database
  await prisma.classRegistration.deleteMany({})
  await prisma.subscription.deleteMany({})
  await prisma.class.deleteMany({})
  await prisma.student.deleteMany({})
  await prisma.parent.deleteMany({})

  console.log('Seed: Start seeding...')

  // 1. Create Parents
  const parent1 = await prisma.parent.create({
    data: {
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'vana@example.com',
    },
  })

  const parent2 = await prisma.parent.create({
    data: {
      name: 'Trần Thị B',
      phone: '0907654321',
      email: 'thib@example.com',
    },
  })

  // 2. Create Students
  const student1 = await prisma.student.create({
    data: {
      name: 'Nguyễn Con Một',
      dob: new Date('2015-05-15'),
      gender: 'Male',
      currentGrade: 3,
      parentId: parent1.id,
    },
  })

  const student2 = await prisma.student.create({
    data: {
      name: 'Nguyễn Con Hai',
      dob: new Date('2017-08-20'),
      gender: 'Female',
      currentGrade: 1,
      parentId: parent1.id,
    },
  })

  const student3 = await prisma.student.create({
    data: {
      name: 'Trần Con Ba',
      dob: new Date('2014-01-10'),
      gender: 'Male',
      currentGrade: 4,
      parentId: parent2.id,
    },
  })

  // 3. Create Classes
  const class1 = await prisma.class.create({
    data: {
      name: 'Lớp Toán Tư Duy',
      subject: 'Toán',
      dayOfWeek: 1, // Thứ 2
      timeSlot: '08:00-10:00',
      teacherName: 'Thầy Cường',
      maxStudents: 20,
    },
  })

  const class2 = await prisma.class.create({
    data: {
      name: 'Lớp Tiếng Anh Giao Tiếp',
      subject: 'Tiếng Anh',
      dayOfWeek: 3, // Thứ 4
      timeSlot: '14:00-16:00',
      teacherName: 'Cô Lan',
      maxStudents: 15,
    },
  })

  // 4. Create an initial Subscription for one student to test
  await prisma.subscription.create({
    data: {
      studentId: student1.id,
      packageName: 'Gói 10 Buổi',
      totalSessions: 10,
      usedSessions: 0,
      endDate: new Date('2026-12-31'),
    },
  })

  console.log('Seed: Database has been seeded. 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
