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

  if (startDate >= endDate)
    throw new Error("End date must be after start date");

  const duration = calculateDuration(startDate, endDate); // Ensure admin exists

  const adminExists = await db.admin.findUnique({
    where: { id: payload.createdBy },
  });
  if (!adminExists) throw new Error("Invalid admin ID provided");

  return await db.internship.create({
    data: {
      title: payload.title,
      description: payload.description,
      startDate,
      endDate,
      duration,
      stipend: parseFloat(payload.price) || 0, // ✅ Updated from stipend to price
      totalAmount: payload.totalAmount ? parseFloat(payload.totalAmount) : 0, // ✅ NEW
      maxSeats: parseInt(payload.maxSeats) || 20,
      isActive: payload.isActive ?? true,
      isArchived: payload.isArchived ?? false,
      deliveryMode: payload.deliveryMode, // ✅ NEW
      venue: payload.venue, // ✅ NEW
      meetingLink: payload.meetingLink, // ✅ NEW
      posterImage: payload.posterImage, // ✅ NEW
      supervisor: payload.supervisor, // ✅ NEW
      supervisorBio: payload.supervisorBio, // ✅ NEW
      incharge: payload.incharge, // ✅ NEW
      formFields: payload.formFields || null,
      createdBy: payload.createdBy,
    },
    include: {
      admin: { select: { id: true, name: true, email: true } },
      _count: { select: { registrations: true } },
    },
  });
}

export async function getAllInternships() {
  return await db.internship.findMany({
    where: { isArchived: false },
    include: {
      admin: { select: { id: true, name: true, email: true } },
      _count: { select: { registrations: true } },
    },
    orderBy: { startDate: "asc" },
  });
}

export async function getInternshipById(id: string) {
  const internship = await db.internship.findUnique({
    where: { id },
    include: {
      admin: { select: { id: true, name: true, email: true } },
      registrations: { orderBy: { createdAt: "desc" } },
      _count: { select: { registrations: true } },
    },
  });
  if (!internship) throw new Error("Internship not found");
  return internship;
}

export async function updateInternship(id: string, payload: any) {
  const existing = await db.internship.findUnique({ where: { id } });
  if (!existing) throw new Error("Internship not found");

  const updateData: any = {};
  if (payload.title !== undefined) updateData.title = payload.title;
  if (payload.description !== undefined)
    updateData.description = payload.description;
  if (payload.price !== undefined)
    updateData.stipend = parseFloat(payload.price); // ✅ Updated from stipend to price
  if (payload.totalAmount !== undefined)
    updateData.totalAmount = parseFloat(payload.totalAmount); // ✅ NEW
  if (payload.maxSeats !== undefined)
    updateData.maxSeats = parseInt(payload.maxSeats);
  if (payload.isActive !== undefined) updateData.isActive = payload.isActive;
  if (payload.isArchived !== undefined)
    updateData.isArchived = payload.isArchived;
  if (payload.deliveryMode !== undefined)
    updateData.deliveryMode = payload.deliveryMode; // ✅ NEW
  if (payload.venue !== undefined) updateData.venue = payload.venue; // ✅ NEW
  if (payload.meetingLink !== undefined)
    updateData.meetingLink = payload.meetingLink; // ✅ NEW
  if (payload.posterImage !== undefined)
    updateData.posterImage = payload.posterImage; // ✅ NEW
  if (payload.supervisor !== undefined)
    updateData.supervisor = payload.supervisor; // ✅ NEW
  if (payload.supervisorBio !== undefined)
    updateData.supervisorBio = payload.supervisorBio; // ✅ NEW
  if (payload.incharge !== undefined) updateData.incharge = payload.incharge; // ✅ NEW
  if (payload.formFields !== undefined)
    updateData.formFields = payload.formFields;

  if (payload.startDate || payload.endDate) {
    const startDate = payload.startDate
      ? new Date(payload.startDate)
      : existing.startDate;
    const endDate = payload.endDate
      ? new Date(payload.endDate)
      : existing.endDate;
    if (startDate >= endDate)
      throw new Error("End date must be after start date");
    updateData.startDate = startDate;
    updateData.endDate = endDate;
    updateData.duration = calculateDuration(startDate, endDate);
  }

  return await db.internship.update({
    where: { id },
    data: updateData,
    include: {
      admin: { select: { id: true, name: true, email: true } },
      _count: { select: { registrations: true } },
    },
  });
}

export async function deleteInternship(id: string) {
  const internship = await db.internship.findUnique({
    where: { id },
    include: { _count: { select: { registrations: true } } },
  });
  if (!internship) throw new Error("Internship not found");
  if (internship._count.registrations > 0)
    throw new Error(
      "Cannot delete internship with registrations. Archive instead."
    );
  return await db.internship.delete({ where: { id } });
}

export async function archiveInternship(id: string) {
  return await db.internship.update({
    where: { id },
    data: { isArchived: true, isActive: false },
    include: {
      admin: { select: { id: true, name: true, email: true } },
      _count: { select: { registrations: true } },
    },
  });
}

// ============ REGISTRATIONS ============

export async function getInternshipRegistrations(internshipId?: string) {
  const where = internshipId ? { internshipId } : {};
  return await db.internshipRegistration.findMany({
    where,
    include: {
      internship: {
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          stipend: true,
          totalAmount: true, // ✅ NEW
          deliveryMode: true, // ✅ NEW
          venue: true, // ✅ NEW
          meetingLink: true, // ✅ NEW
          supervisor: true, // ✅ NEW
          incharge: true, // ✅ NEW
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInternshipRegistration(payload: any) {
  const internship = await db.internship.findUnique({
    where: { id: payload.internshipId },
    include: { _count: { select: { registrations: true } } },
  });
  if (!internship) throw new Error("Internship not found");
  if (!internship.isActive)
    throw new Error("Internship not active for registration");
  if (internship._count.registrations >= internship.maxSeats)
    throw new Error("Internship is full");

  const exists = await db.internshipRegistration.findFirst({
    where: { internshipId: payload.internshipId, email: payload.email },
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
      status: payload.status || "PENDING",
    },
    include: {
      internship: {
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          stipend: true,
        },
      },
    },
  });
}

export async function updateInternshipRegistration(id: string, payload: any) {
  const existing = await db.internshipRegistration.findUnique({
    where: { id },
  });
  if (!existing) throw new Error("Registration not found");

  return await db.internshipRegistration.update({
    where: { id },
    data: payload,
    include: {
      internship: { select: { id: true, title: true, stipend: true } },
    },
  });
}

export async function deleteInternshipRegistration(id: string) {
  const existing = await db.internshipRegistration.findUnique({
    where: { id },
  });
  if (!existing) throw new Error("Registration not found");
  return await db.internshipRegistration.delete({ where: { id } });
}
export async function getActiveInternship() {
  return await db.internship.findMany({
    where: { isActive: true, isArchived: false },
    orderBy: { startDate: "asc" },
  });
}
