import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

import db from "db"
import { NotFoundError } from "blitz"

export const updateSchemaSchema = z.object({
  id: z.string(),
  data: z.object({ name: z.string(), code: z.string() }).partial(),
})

const updateSchemaFn = resolver.pipe(
  resolver.zod(updateSchemaSchema),
  resolver.authorize(),
  async ({ id, data }) => {
    const schema = await db.schema.findUnique({ where: { id } })
    if (!schema) throw new NotFoundError()

    return db.schema.update({ where: { id }, data: { ...data } })
  }
)

export default updateSchemaFn
