import React, { Suspense } from "react"
import { BlitzPage, useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getSchema from "../../../app/schemas/queries/getSchema"

const Schema: React.FC = () => {
  const id = useParam("schemaId", "string")!
  const [schema] = useQuery(getSchema, { id })

  return (
    <div>
      <h1>{schema.name}</h1>
    </div>
  )
}

const SchemaPage: BlitzPage = () => {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Schema />
    </Suspense>
  )
}

export default SchemaPage
