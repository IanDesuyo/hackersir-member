import { z } from "zod";
import { userIdOrMe } from "./utils";

export const userIdInput = z.object({
  userId: userIdOrMe,
});

export const eventIdInput = z.object({
  eventId: z.string(),
});
