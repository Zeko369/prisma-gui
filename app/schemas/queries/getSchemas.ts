import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

import db from "db"

export const getSchemasSchema = z.void()

const getSchemas = resolver.pipe(
  resolver.zod(getSchemasSchema),
  resolver.authorize(),
  async (_, ctx) => {
    return db.schema.findMany({ where: { userId: ctx.session.userId } })
  }
)

export default getSchemas
