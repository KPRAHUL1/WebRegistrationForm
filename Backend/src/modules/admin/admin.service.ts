import { db } from "../../shared/lib/db";
import bcrypt from "bcrypt";
import { generateJwtToken } from "../../shared/lib/utils/jwt";
import { JwtPayload } from "../../shared/lib/models/jwtModel";

export async function adminLogin(payload: { email: string; password: string }) {
  // 1. Find admin by email
  const admin = await db.admin.findUnique({
    where: { email: payload.email }
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  // 2. Verify password
  const passwordValid = await bcrypt.compare(payload.password, admin.password);
  if (!passwordValid) {
    throw new Error("Invalid credentials");
  }

  // 3. Generate JWT token using your existing utility
  const tokenPayload: JwtPayload = {
    id: admin.id,
    email: admin.email,
    role: admin.role
  };
  const token = generateJwtToken(tokenPayload);

  // 4. Return admin data without password
  const { password: _, ...adminWithoutPassword } = admin;

  return {
    admin: adminWithoutPassword,
    token
  };
}

export async function getAdminProfile(id: string) {
  return await db.admin.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}