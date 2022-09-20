import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

import db from "db"
import { defaultPrismaSchema } from "../constants/default"
import { createSchemaSchema } from "../validation/schema"

const createSchemaFn = resolver.pipe(
  resolver.zod(createSchemaSchema),
  resolver.authorize(),
  async (data, ctx) => {
    return db.schema.create({
      data: {
        user: { connect: { id: ctx.session.userId } },
        name: data.name,
        code: defaultPrismaSchema,
      },
    })
  }
)

export default createSchemaFn
