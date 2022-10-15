import prisma from "./prisma";
import { add } from "date-fns";

async function main() {
  await prisma.testResult.deleteMany({});
  await prisma.courseEnrollment.deleteMany({});
  await prisma.test.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.course.deleteMany({});

  const weekFromNow = add(new Date(), { days: 7 });
  const twoWeekFromNow = add(new Date(), { days: 7 });
  const monthFromNow = add(new Date(), { days: 7 });

  const justin = await prisma.user.create({
    data: {
      email: "justin@email.com",
      firstName: "Justin",
      lastName: "Justin",
      social: {
        facebook: "justinsolo",
        twitter: "justinsolo",
      },
    },
  });

  const course = await prisma.course.create({
    data: {
      name: "CRUD with Prisma",
      tests: {
        create: [
          {
            date: weekFromNow,
            name: "Test 1",
          },
          {
            date: twoWeekFromNow,
            name: "Test 2",
          },
          {
            date: monthFromNow,
            name: "Test 3",
          },
        ],
      },
      members: {
        create: {
          role: "TEACHER",
          user: {
            connect: {
              email: "justin@email.com",
            },
          },
        },
      },
    },
    include: {
      tests: true,
    },
  });

  const david = await prisma.user.create({
    data: {
      email: "david@email.com",
      firstName: "David",
      lastName: "David",
      social: {
        facebook: "david",
        twitter: "david",
      },
      courses: {
        create: {
          role: "STUDENT",
          course: {
            connect: { id: course.id },
          },
        },
      },
    },
  });

  const ben = await prisma.user.create({
    data: {
      email: "ben@email.com",
      firstName: "Ben",
      lastName: "Ben",
      social: {
        facebook: "Ben",
        twitter: "Benben",
      },
      courses: {
        create: {
          role: "STUDENT",
          course: {
            connect: { id: course.id },
          },
        },
      },
    },
  });

  const testResultsDavid = [650, 900, 950];
  const testResultsBen = [700, 800, 900];

  let counter = 0;

  for (const test of course.tests) {
    await prisma.testResult.create({
      data: {
        gradedBy: {
          connect: { email: justin.email },
        },
        student: {
          connect: { email: ben.email },
        },
        test: {
          connect: { id: test.id },
        },
        result: testResultsBen[counter],
      },
    });

    await prisma.testResult.create({
      data: {
        gradedBy: {
          connect: { email: justin.email },
        },
        student: {
          connect: { email: david.email },
        },
        test: {
          connect: { id: test.id },
        },
        result: testResultsDavid[counter],
      },
    });
    counter++;
  }

  // Get aggregate results for all tests
  for (const test of course.tests) {
    const result = await prisma.testResult.aggregate({
      where: {
        testId: test.id,
      },
      _avg: { result: true },
      _max: { result: true },
      _min: { result: true },
      _count: true,
    });
    console.log(`test: ${test.name} (id: ${test.id})`, result);
  }

  // Get aggregate results for all tests for a specific student

  // Ben
  const benAggregate = await prisma.testResult.aggregate({
    where: {
      student: {
        email: ben.email,
      },
    },
    _avg: { result: true },
    _max: { result: true },
    _min: { result: true },
    _count: true,
  });
  console.log(`Ben's result (email: ${ben.email})`, benAggregate);

  // David
  const davidAggregate = await prisma.testResult.aggregate({
    where: {
      student: {
        email: david.email,
      },
    },
    _avg: { result: true },
    _max: { result: true },
    _min: { result: true },
    _count: true,
  });
  console.log(`David's result (email: ${david.email})`, davidAggregate);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
