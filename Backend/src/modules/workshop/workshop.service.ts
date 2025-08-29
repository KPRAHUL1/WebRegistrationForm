
import { db } from "../../shared/lib/db";

export async function createWorkshop(payload: any) {
  // Coerce incoming values to correct types
  const parsedPrice = payload.price !== undefined ? parseFloat(payload.price) : 0;
  const parsedTotalAmount = payload.totalAmount !== undefined && payload.totalAmount !== ''
    ? parseFloat(payload.totalAmount)
    : parsedPrice;
  const parsedMaxSeats = payload.maxSeats !== undefined && payload.maxSeats !== ''
    ? parseInt(payload.maxSeats, 10)
    : 50;
  const parsedStartDate = payload.startDate ? new Date(payload.startDate) : new Date();
  const parsedEndDate = payload.endDate ? new Date(payload.endDate) : parsedStartDate;
  const parsedIsActive = typeof payload.isActive === 'string' ? payload.isActive === 'true' : !!payload.isActive;
  const parsedIsArchived = typeof payload.isArchived === 'string' ? payload.isArchived === 'true' : !!payload.isArchived;
  const parsedDeliveryMode = payload.deliveryMode || 'OFFLINE';

  // Validate createdBy: only set if points to an existing Admin; otherwise omit
  let createdByValue: string | undefined = undefined;
  if (typeof payload.createdBy === 'string' && payload.createdBy.trim().length > 0) {
    const admin = await db.admin.findUnique({ where: { id: payload.createdBy } });
    if (admin) {
      createdByValue = admin.id;
    }
  }

  return await db.workshop.create({
    data: {
      title: payload.title,
      description: payload.description,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
      price: parsedPrice,
      totalAmount: parsedTotalAmount,
      maxSeats: parsedMaxSeats,
      createdBy: createdByValue, // optional FK
      isActive: parsedIsActive,
      isArchived: parsedIsArchived,
      deliveryMode: parsedDeliveryMode,
      venue: payload.venue,
      meetingLink: payload.meetingLink,
      posterImage: payload.posterImage,
      teacher: payload.teacher,
      teacherBio: payload.teacherBio,
      incharge: payload.incharge,
      formFields: payload.formFields
    }
  });
}

export async function getAllWorkshops() {
  return await db.workshop.findMany({
    where: { isArchived: false },
    orderBy: { startDate: 'asc' }
  });
}

export async function getWorkshopById(id: string) {
  return await db.workshop.findUnique({
    where: { id },
  });
}

export async function updateWorkshop(id: string, payload: any) {
  const updateData: any = {};
  
  // Only update fields that are provided
  if (payload.title !== undefined) updateData.title = payload.title;
  if (payload.description !== undefined) updateData.description = payload.description;
  if (payload.startDate !== undefined) updateData.startDate = new Date(payload.startDate);
  if (payload.endDate !== undefined) updateData.endDate = new Date(payload.endDate);
  if (payload.startTime !== undefined) updateData.startTime = payload.startTime;
  if (payload.endTime !== undefined) updateData.endTime = payload.endTime;
  if (payload.price !== undefined) updateData.price = parseFloat(payload.price);
  if (payload.totalAmount !== undefined) updateData.totalAmount = parseFloat(payload.totalAmount);
  if (payload.maxSeats !== undefined) updateData.maxSeats = typeof payload.maxSeats === 'string' ? parseInt(payload.maxSeats, 10) : payload.maxSeats;
  if (payload.deliveryMode !== undefined) updateData.deliveryMode = payload.deliveryMode;
  if (payload.venue !== undefined) updateData.venue = payload.venue;
  if (payload.meetingLink !== undefined) updateData.meetingLink = payload.meetingLink;
  if (payload.posterImage !== undefined) updateData.posterImage = payload.posterImage;
  if (payload.teacher !== undefined) updateData.teacher = payload.teacher;
  if (payload.teacherBio !== undefined) updateData.teacherBio = payload.teacherBio;
  if (payload.incharge !== undefined) updateData.incharge = payload.incharge;
  if (payload.formFields !== undefined) updateData.formFields = payload.formFields;
  if (payload.isActive !== undefined) updateData.isActive = typeof payload.isActive === 'string' ? payload.isActive === 'true' : !!payload.isActive;

  return await db.workshop.update({
    where: { id },
    data: updateData
  });
}

export async function deleteWorkshop(id: string) {
  return await db.workshop.delete({
    where: { id }
  });
}