// workshopRegister.service.ts
import { db } from "../../shared/lib/db";

export async function registerForWorkshop(payload: any) {
  return await db.$transaction(async (tx) => {
    // 1. Create payment record
    const payment = await tx.payment.create({
      data: {
        amount: parseFloat(payload.amount) || 0, // Convert string to number
        currency: "INR",
        paymentMethod: "UPI",
        upiId: payload.upiId,
        status: "PENDING",
        paymentProof: payload.paymentProof,
      }
    });

    // 2. Create workshop registration
    return await tx.workshopRegistration.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        college: payload.collegeName, // Note: mapping collegeName to college
        branch: payload.department,   // Note: mapping department to branch
        year: payload.year,
        experience: payload.experience,
        formData: payload.formData,
        paymentScreenshot: payload.paymentProof,
        workshopId: payload.workshopId,
        paymentId: payment.id
      },
      include: {
        workshop: {
          select: {
            title: true,
            startDate: true
          }
        },
        payment: true
      }
    });
  });
}
// All other functions are correct and can be left as is.
export async function getWorkshopById(id: string) {
  return await db.workshop.findUnique({
    where: { id },
    include: {
      registrations: true
    }
  });
}

export async function getActiveWorkshops() {
  return await db.workshop.findMany({
    where: { isActive: true, isArchived: false },
    orderBy: { startDate: 'asc' }
  });
}

export async function getWorkshopRegistrations(workshopId: string) {
  return await db.workshopRegistration.findMany({
    where: { workshopId },
    include: {
      payment: true,
      workshop: {
        select: {
          title: true,
          price: true
        }
      }
    }
  });
}

export async function verifyPayment(registrationId: string) {
  return await db.workshopRegistration.update({
    where: { id: registrationId },
    data: {
      status: "CONFIRMED",
      payment: {
        update: {
          status: "SUCCESS",
          verifiedAt: new Date()
        }
      }
    }
  });
}