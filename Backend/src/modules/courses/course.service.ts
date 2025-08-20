import { db } from "../../shared/lib/db";
import { Prisma } from '@prisma/client';

// Helper function to calculate duration
function calculateDuration(startDate: Date, endDate: Date): string {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return "1 day";
  } else if (diffDays < 7) {
    return `${diffDays} days`;
  } else if (diffDays < 30) {
    const weeks = Math.ceil(diffDays / 7);
    return weeks === 1 ? "1 week" : `${weeks} weeks`;
  } else {
    const months = Math.ceil(diffDays / 30);
    return months === 1 ? "1 month" : `${months} months`;
  }
}

export async function createCourse(payload: any) {
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);
  
  // Validate dates
  if (startDate >= endDate) {
    throw new Error("End date must be after start date");
  }
  
  // Calculate duration
  const duration = calculateDuration(startDate, endDate);
  
  // Ensure createdBy references an existing admin
  const adminExists = await db.admin.findUnique({
    where: { id: payload.createdBy }
  });
  
  if (!adminExists) {
    throw new Error("Invalid admin ID provided");
  }

  return await db.course.create({
    data: {
      title: payload.title,
      description: payload.description,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      price: parseFloat(payload.price) || 0,
      maxSeats: parseInt(payload.maxSeats) || 50,
      createdBy: payload.createdBy,
      isActive: payload.isActive ?? true,
      isArchived: payload.isArchived ?? false,
      formFields: payload.formFields || null,
    },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      _count: {
        select: {
          registrations: true
        }
      }
    }
  });
}

export async function getAllCourses() {
  return await db.course.findMany({
    where: { 
      isArchived: false 
    },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      _count: {
        select: {
          registrations: true
        }
      }
    },
    orderBy: { 
      startDate: "asc" 
    },
  });
}

export async function getCourseById(id: string) {
  const course = await db.course.findUnique({
    where: { id },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      registrations: {
        orderBy: {
          createdAt: "desc"
        }
      },
      _count: {
        select: {
          registrations: true
        }
      }
    }
  });
  
  if (!course) {
    throw new Error("Course not found");
  }
  
  return course;
}

export async function updateCourse(id: string, payload: any) {
  // Check if course exists
  const existingCourse = await db.course.findUnique({
    where: { id }
  });
  
  if (!existingCourse) {
    throw new Error("Course not found");
  }

  // Prepare update data
  const updateData: any = {};
  
  if (payload.title !== undefined) updateData.title = payload.title;
  if (payload.description !== undefined) updateData.description = payload.description;
  if (payload.price !== undefined) updateData.price = parseFloat(payload.price);
  if (payload.maxSeats !== undefined) updateData.maxSeats = parseInt(payload.maxSeats);
  if (payload.isActive !== undefined) updateData.isActive = payload.isActive;
  if (payload.isArchived !== undefined) updateData.isArchived = payload.isArchived;
  if (payload.formFields !== undefined) updateData.formFields = payload.formFields;
  
  // Handle date updates and recalculate duration if needed
  if (payload.startDate !== undefined || payload.endDate !== undefined) {
    const startDate = payload.startDate ? new Date(payload.startDate) : existingCourse.startDate;
    const endDate = payload.endDate ? new Date(payload.endDate) : existingCourse.endDate;
    
    if (startDate >= endDate) {
      throw new Error("End date must be after start date");
    }
    
    updateData.startDate = startDate;
    updateData.endDate = endDate;
    updateData.duration = calculateDuration(startDate, endDate);
  }

  return await db.course.update({
    where: { id },
    data: updateData,
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      _count: {
        select: {
          registrations: true
        }
      }
    }
  });
}

export async function deleteCourse(id: string) {
  // Check if course has registrations
  const courseWithRegistrations = await db.course.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          registrations: true
        }
      }
    }
  });
  
  if (!courseWithRegistrations) {
    throw new Error("Course not found");
  }
  
  if (courseWithRegistrations._count.registrations > 0) {
    throw new Error("Cannot delete course with existing registrations. Archive it instead.");
  }

  return await db.course.delete({
    where: { id },
  });
}

export async function archiveCourse(id: string) {
  return await db.course.update({
    where: { id },
    data: { 
      isArchived: true,
      isActive: false 
    },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      _count: {
        select: {
          registrations: true
        }
      }
    }
  });
}

// Course Registration Service Functions
export async function getCourseRegistrations(courseId?: string) {
  const where = courseId ? { courseId } : {};
  
  return await db.courseRegistration.findMany({
    where,
    include: {
      course: {
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          price: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function createCourseRegistration(payload: any) {
  // Validate course exists and has available seats
  const course = await db.course.findUnique({
    where: { id: payload.courseId },
    include: {
      _count: {
        select: {
          registrations: true
        }
      }
    }
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (!course.isActive) {
    throw new Error("Course is not currently active for registration");
  }

  if (course._count.registrations >= course.maxSeats) {
    throw new Error("Course is full");
  }

  // Check for duplicate registration
  const existingRegistration = await db.courseRegistration.findFirst({
    where: {
      courseId: payload.courseId,
      email: payload.email
    }
  });

  if (existingRegistration) {
    throw new Error("This email is already registered for this course");
  }

  return await db.courseRegistration.create({
    data: {
      courseId: payload.courseId,
      name: payload.name,  // Use fullName instead of name
      email: payload.email,
      phone: payload.phone,
      formData: payload.formData,
      status: payload.status || "pending",
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          price: true,
        }
      }
    }
  });
}

export async function updateCourseRegistration(id: string, payload: any) {
  const existingRegistration = await db.courseRegistration.findUnique({
    where: { id }
  });

  if (!existingRegistration) {
    throw new Error("Registration not found");
  }

  // Prepare update data
  const updateData: any = {};
  
  if (payload.name !== undefined) updateData.fullName = payload.name; // Use fullName
  if (payload.email !== undefined) updateData.email = payload.email;
  if (payload.phone !== undefined) updateData.phone = payload.phone;
  if (payload.status !== undefined) updateData.status = payload.status;
  if (payload.formData !== undefined) updateData.formData = payload.formData;

  return await db.courseRegistration.update({
    where: { id },
    data: updateData,
    include: {
      course: {
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          price: true,
        }
      }
    }
  });
}

export async function deleteCourseRegistration(id: string) {
  const registration = await db.courseRegistration.findUnique({
    where: { id }
  });

  if (!registration) {
    throw new Error("Registration not found");
  }

  return await db.courseRegistration.delete({
    where: { id }
  });
}