import { z } from "zod";
import { stringOrNull } from "./utils";

export const eventIdInput = z.object({
  eventId: z.string(),
});

export const getAllInput = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().min(1).max(50).default(10).optional(),
  offset: z.number().int().default(0).optional(),
});

export const eventFormSchema = z.object({
  name: z.string().min(3),
  description: stringOrNull(z.string()),
  type: z.string(),
  venue: stringOrNull(z.string()),
  links: stringOrNull(z.string().url()),
  lecturer: stringOrNull(z.string()),
  lecturerDescription: stringOrNull(z.string()),
  lecturerImage: stringOrNull(z.string().url()),
  lecturerLink: stringOrNull(z.string().url()),
  startAt: z.date(),
  endAt: z.date(),
});

export const updateByIdInput = eventFormSchema.extend({
  eventId: z.string(),
});