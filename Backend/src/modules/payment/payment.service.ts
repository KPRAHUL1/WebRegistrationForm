// payment.service.ts
import { db } from "../../shared/lib/db";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
interface CreatePaymentParams {
  amount: number;
  upiId: string; // Organization's UPI ID
  payerUpiId?: string; // User's UPI ID (optional)
  workshopId?: string;
  courseId?: string;
  registrationId: string;
  paymentMethod?: PaymentMethod;
}
export const createPayment = async (params: CreatePaymentParams) => {
  return await db.payment.create({
    data: {
      amount: params.amount,
      currency: "INR",
      paymentMethod: params.paymentMethod || "UPI",
      upiId: params.upiId, // Organization's UPI
      status: "PENDING",
      workshopId: params.workshopId,
      courseId: params.courseId,
      ...(params.workshopId 
        ? { workshopRegistration: { connect: { id: params.registrationId } } } 
        : { courseRegistration: { connect: { id: params.registrationId } } })
    },
    include: {
      workshop: { select: { title: true } },
      course: { select: { title: true } }
    }
  });
};

export const verifyPayment = async (
  paymentId: string,
  screenshotUrl: string,
  transactionId?: string
) => {
  return await db.payment.update({
    where: { id: paymentId },
    data: { 
      status: "SUCCESS",
      paymentProof: screenshotUrl,
      transactionId,
      verifiedAt: new Date()
    }
  });
};

export const getPaymentDetails = async (paymentId: string) => {
  return await db.payment.findUnique({
    where: { id: paymentId },
    include: {
      workshop: { select: { title: true } },
      course: { select: { title: true } }
    }
  });
};

import { createIncome } from "../income/income.service";

export async function updatePaymentStatus(
  id: string, 
  status: string,
  reason?: string
) {
  const updatedPayment = await db.payment.update({
    where: { id },
    data: { 
      status: status as any,
      ...(reason && { statusReason: reason })
    }
  });

  if (updatedPayment.status === 'SUCCESS') {
    await createIncome(updatedPayment);
  }

  return updatedPayment;
}


export async function getPaymentById(id: string) {
  return await db.payment.findUnique({
    where: { id },
    include: {
      workshop: { select: { title: true } },
      course: { select: { title: true } }
    }
  });
}

export async function getPaymentsByWorkshop(workshopId: string) {
  return await db.payment.findMany({
    where: { workshopId },
    orderBy: { createdAt: 'desc' }
  });
}