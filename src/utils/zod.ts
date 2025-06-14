import { z } from "zod";

export const issuesSchema = z.object({
  issues: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});

export type Issue = z.infer<typeof issuesSchema>;
