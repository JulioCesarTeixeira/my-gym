import { z } from "zod";

export const ExerciseSchema = z.object({
  created_at: z.string(),
  demo: z.string(),
  group: z.string(),
  id: z.number(),
  name: z.string(),
  repetitions: z.number(),
  series: z.number(),
  thumb: z.string(),
  updated_at: z.string(),
});

export type ExerciseDTO = z.infer<typeof ExerciseSchema>;

export const ExerciseListSchema = z.array(ExerciseSchema);
