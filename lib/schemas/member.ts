import { z } from "zod";

export const userIdInput = z.object({
  userId: z.string().cuid().or(z.literal("me")),
});

export const profileFormSchema = z.object({
  name: z.string().min(1).max(16),
});

export const updateProfileInput = profileFormSchema.extend({
  userId: z.string().cuid().or(z.literal("me")),
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
  userId: z.string().cuid().or(z.literal("me")),
});

export const getStatusByIdInput = userIdInput.extend({
  year: z.number().int().min(2013).max(new Date().getFullYear()).optional(),
});

export const getCodeByIdInput = userIdInput.extend({
  aud: z.string().optional(),
});

export const verifyCodeInput = z.object({
  code: z.string().min(9),
  aud: z.string().optional(),
});
