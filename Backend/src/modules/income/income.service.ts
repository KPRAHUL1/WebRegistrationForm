import { db } from "../../shared/lib/db";

export async function createIncome(payment: any) {
  let source = "General";
  if (payment.workshopId) {
    const workshop = await db.workshop.findUnique({ where: { id: payment.workshopId } });
    if (workshop) {
      source = `Workshop Fee: ${workshop.title}`;
    }
  } else if (payment.courseId) {
    const course = await db.course.findUnique({ where: { id: payment.courseId } });
    if (course) {
      source = `Course Fee: ${course.title}`;
    }
  }

  return await db.income.create({
    data: {
      amount: payment.amount,
      source: source,
      paymentId: payment.id,
    },
  });
}

// Create income from workshop registration
export async function createIncomeFromWorkshopRegistration(registrationId: string, amount: number) {
  const registration = await db.workshopRegistration.findUnique({
    where: { id: registrationId },
    include: { workshop: true }
  });

  if (!registration) {
    throw new Error('Workshop registration not found');
  }

  return await db.income.create({
    data: {
      amount: amount,
      source: `Workshop Registration: ${registration.workshop.title}`,
      description: `Registration by ${registration.name} (${registration.email})`,
    },
  });
}

// Create income from course registration
export async function createIncomeFromCourseRegistration(registrationId: string, amount: number) {
  const registration = await db.courseRegistration.findUnique({
    where: { id: registrationId },
    include: { course: true }
  });

  if (!registration) {
    throw new Error('Course registration not found');
  }

  return await db.income.create({
    data: {
      amount: amount,
      source: `Course Registration: ${registration.course.title}`,
      description: `Registration by ${registration.name} (${registration.email})`,
    },
  });
}

export async function getAllIncomes() {
  return await db.income.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getIncomeById(id: string) {
  return await db.income.findUnique({
    where: { id },
    include: {
      payment: true,
    }
  });
}

// Get total income
export async function getTotalIncome() {
  const result = await db.income.aggregate({
    _sum: {
      amount: true
    }
  });
  return result._sum.amount || 0;
}
