import { z } from "zod";

export const userIdInput = z.object({
  userId: z.string().cuid().or(z.literal("me")),
});
