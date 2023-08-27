import { z } from "zod";

export const searchInput = z.object({
  query: z.string(),
  search: z.array(z.enum(["userId", "studentId", "realname", "receiptId", "discordId"])),
});
