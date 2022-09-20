import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

import db from "db"
import { AuthorizationError, NotFoundError } from "blitz"

export const getSchemaSchema = z.object({ id: z.string() })

const getSchema = resolver.pipe(
  resolver.zod(getSchemaSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const schema = await db.schema.findUnique({ where: { id } })
    if (!schema) throw new NotFoundError()
    if (schema.userId !== ctx.session.userId) throw new AuthorizationError()

    return schema
  }
)

export default getSchema
