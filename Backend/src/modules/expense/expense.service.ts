import { db } from "../../shared/lib/db";

export async function createExpense(payload: any) {
  return await db.expense.create({
    data: {
      amount: parseFloat(payload.amount),
      category: payload.category,
      description: payload.description,
      spentAt: payload.spentAt ? new Date(payload.spentAt) : new Date(),
    },
  });
}

export async function getAllExpenses() {
  return await db.expense.findMany({
    orderBy: { spentAt: 'desc' }
  });
}

export async function getExpenseById(id: string) {
  return await db.expense.findUnique({
    where: { id },
  });
}

export async function updateExpense(id: string, payload: any) {
  return await db.expense.update({
    where: { id },
    data: {
      amount: payload.amount ? parseFloat(payload.amount) : undefined,
      category: payload.category,
      description: payload.description,
      spentAt: payload.spentAt ? new Date(payload.spentAt) : undefined,
    },
  });
}

export async function deleteExpense(id: string) {
  return await db.expense.delete({
    where: { id },
  });
}

// Get total expenses
export async function getTotalExpenses() {
  const result = await db.expense.aggregate({
    _sum: {
      amount: true
    }
  });
  return result._sum.amount || 0;
}
