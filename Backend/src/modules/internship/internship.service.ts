import { db } from "../../shared/lib/db";

// Helper: calculate duration
function calculateDuration(startDate: Date, endDate: Date): string {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 day";
  if (diffDays < 7) return `${diffDays} days`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
  return `${Math.ceil(diffDays / 30)} months`;
}

// ============ INTERNSHIP CRUD ============

export async function createInternship(payload: any) {
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (startDate >= endDate) throw new Error("End date must be after start date");

  const duration = calculateDuration(startDate, endDate);

  // Ensure admin exists
  const adminExists = await db.admin.findUnique({ where: { id: payload.createdBy } });
  if (!adminExists) throw new Error("Invalid admin ID provided");

  return await db.internship.create({
    data: {
      title: payload.title,
      description: payload.description,
      startDate,
      endDate,
      duration,
      stipend: parseFloat(payload.stipend) || 0,
      maxSeats: parseInt(payload.maxSeats) || 20,
      createdBy: payload.createdBy,
      isActive: payload.isActive ?? true,
      isArchived: payload.isArchived ?? false,
      formFields: payload.formFields || null,
    },
    include: {
      admin: { select: { id: true, name: true, email: true } },
      _count: { select: { registrations: true } }
    }
  });
}

export async function getAllInternships() {
  return await db.internship.findMany({
    where: { isArchived: false },
    include: {
      admin: { select: { id: true, name: true, email: true } },
      _count: { select: { registrations: true } }
    },
    orderBy: { startDate: "asc" }
  });
}

export async function getInternshipById(id: string) {
  const internship = await db.internship.findUnique({
    where: { id },
    include: {
      admin: { select: { id: true, name: true, email: true } },
      registrations: { orderBy: { createdAt: "desc" } },
      _count: { select: { registrations: true } }
    }
  });
  if (!internship) throw new Error("Internship not found");
  return internship;
}

export async function updateInternship(id: string, payload: any) {
  const existing = await db.internship.findUnique({ where: { id } });
  if (!existing) throw new Error("Internship not found");

  const updateData: any = {};
  if (payload.title !== undefined) updateData.title = payload.title;
  if (payload.description !== undefined) updateData.description = payload.description;
  if (payload.stipend !== undefined) updateData.stipend = parseFloat(payload.stipend);
  if (payload.maxSeats !== undefined) updateData.maxSeats = parseInt(payload.maxSeats);
  if (payload.isActive !== undefined) updateData.isActive = payload.isActive;
  if (payload.isArchived !== undefined) updateData.isArchived = payload.isArchived;
  if (payload.formFields !== undefined) updateData.formFields = payload.formFields;

  if (payload.startDate || payload.endDate) {
    const startDate = payload.startDate ? new Date(payload.startDate) : existing.startDate;
    const endDate = payload.endDate ? new Date(payload.endDate) : existing.endDate;
    if (startDate >= endDate) throw new Error("End date must be after start date");
    updateData.startDate = startDate;
    updateData.endDate = endDate;
    updateData.duration = calculateDuration(startDate, endDate);
  }

  return await db.internship.update({
    where: { id },
    data: updateData,
    include: {
      admin: { select: { id: true, name: true, email: true } },
      _count: { select: { registrations: true } }
    }
  });
}

export async function deleteInternship(id: string) {
  const internship = await db.internship.findUnique({
    where: { id },
    include: { _count: { select: { registrations: true } } }
  });
  if (!internship) throw new Error("Internship not found");
  if (internship._count.registrations > 0)
    throw new Error("Cannot delete internship with registrations. Archive instead.");
  return await db.internship.delete({ where: { id } });
}

export async function archiveInternship(id: string) {
  return await db.internship.update({
    where: { id },
    data: { isArchived: true, isActive: false },
    include: {
      admin: { select: { id: true, name: true, email: true } },
      _count: { select: { registrations: true } }
    }
  });
}

// ============ REGISTRATIONS ============

export async function getInternshipRegistrations(internshipId?: string) {
  const where = internshipId ? { internshipId } : {};
  return await db.internshipRegistration.findMany({
    where,
    include: {
      internship: { select: { id: true, title: true, startDate: true, endDate: true, stipend: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createInternshipRegistration(payload: any) {
  const internship = await db.internship.findUnique({
    where: { id: payload.internshipId },
    include: { _count: { select: { registrations: true } } }
  });
  if (!internship) throw new Error("Internship not found");
  if (!internship.isActive) throw new Error("Internship not active for registration");
  if (internship._count.registrations >= internship.maxSeats) throw new Error("Internship is full");

  const exists = await db.internshipRegistration.findFirst({
    where: { internshipId: payload.internshipId, email: payload.email }
  });
  if (exists) throw new Error("Email already registered for this internship");

  return await db.internshipRegistration.create({
    data: {
      internshipId: payload.internshipId,
      name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      college: payload.collegeName,
      year: payload.year,
      branch: payload.department,
      cgpa: payload.cgpa,
      resume: payload.resume,
      coverLetter: payload.coverLetter,
      formData: payload.formData,
      status: payload.status || "PENDING"
    },
    include: {
      internship: { select: { id: true, title: true, startDate: true, endDate: true, stipend: true } }
    }
  });
}

export async function updateInternshipRegistration(id: string, payload: any) {
  const existing = await db.internshipRegistration.findUnique({ where: { id } });
  if (!existing) throw new Error("Registration not found");

  return await db.internshipRegistration.update({
    where: { id },
    data: payload,
    include: {
      internship: { select: { id: true, title: true, stipend: true } }
    }
  });
}

export async function deleteInternshipRegistration(id: string) {
  const existing = await db.internshipRegistration.findUnique({ where: { id } });
  if (!existing) throw new Error("Registration not found");
  return await db.internshipRegistration.delete({ where: { id } });
}
export async function getActiveInternship() {
  return await db.internship.findMany({
    where: { isActive: true, isArchived: false },
    orderBy: { startDate: 'asc' }
  });
}