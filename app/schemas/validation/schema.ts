import { z } from "zod"

export const createSchemaSchema = z.object({ name: z.string() })
