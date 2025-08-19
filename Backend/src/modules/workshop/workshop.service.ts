
import { db } from "../../shared/lib/db";


export async function createWorkshop(payload: any) {
  return await db.workshop.create({
    data: {
      title: payload.title,
      description: payload.description,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      startTime: payload.startTime,
      endTime: payload.endTime,
      price: parseFloat(payload.price),
      maxSeats: payload.maxSeats || 50,
      createdBy: payload.createdBy,
      isActive: payload.isActive ?? false, 
      isArchived: payload.isArchived ?? false,
    }
  });
}
export async function getAllWorkshops() {
  return await db.workshop.findMany({
    where: {  isArchived: false },
    orderBy: { startDate: 'asc' }
  });
}

export async function updateWorkshop(id: string, payload: any) {
  return await db.workshop.update({
    where: { id },
    data: {
      title: payload.title,
      description: payload.description,
      startDate: payload.startDate,
      endDate: payload.endDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
      price: payload.price,
      maxSeats: payload.maxSeats,
      formFields: payload.formFields,
      isActive: payload.isActive,  // 👈 admin sets true/false
      isArchived: payload.isArchived
    }
  });
}
export async function deleteWorkshop(id: string) {
  return await db.workshop.delete({
    where: { id }
  });
}