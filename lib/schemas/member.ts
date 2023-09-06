import { z } from "zod";
import { userId, userIdOrMe, yearNumber } from "./utils";

export const userIdInput = z.object({
  userId: userIdOrMe,
});

export const profileFormSchema = z.object({
  name: z.string().min(1).max(16),
});

export const updateProfileInput = profileFormSchema.extend({
  userId: userIdOrMe,
});

export const studentDataFormSchema = z.object({
  school: z.string().min(1).max(16),
  realname: z.string().min(2).max(32),
  studentId: z.string().min(4).max(16).toUpperCase(),
  department: z.string().min(3).max(16),
  major: z.string().min(1).max(16),
  class: z.string().min(1).max(16).toUpperCase(),
});

export const updateStudentDataInput = studentDataFormSchema.extend({
  userId: userIdOrMe,
});

export const getStatusByIdInput = userIdInput.extend({
  year: yearNumber.optional(),
});

export const getCodeByIdInput = userIdInput.extend({
  aud: z.string().optional(),
});

export const verifyCodeInput = z.object({
  code: z.string().min(9),
  aud: z.string().optional(),
});

export const getAllMembersInput = z.object({
  year: yearNumber.optional(),
  status: z.enum(["all", "active", "inactive", "suspended"]).optional(),
  query: z.string().optional(),
});

export const updateMemberStatusInput = z.object({
  userId: userId,
  year: yearNumber.optional(),
  active: z.boolean().optional(),
  suspended: z.boolean().optional(),
  sendEmail: z.boolean().optional(),
});
