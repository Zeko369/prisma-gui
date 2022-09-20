import React, { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"

import createSchemaFn from "../../app/schemas/mutations/createSchema"
import getSchemas from "../../app/schemas/queries/getSchemas"
import Form from "../../app/core/components/Form"
import LabeledTextField from "../../app/core/components/LabeledTextField"
import { createSchemaSchema } from "../../app/schemas/validation/schema"

const NewSchema: React.FC = () => {
  const [createSchema] = useMutation(createSchemaFn)
  const router = useRouter()

  return (
    <Form
      schema={createSchemaSchema}
      onSubmit={async (data) => {
        const schema = await createSchema(data)

        await invalidateQuery(getSchemas, undefined)
        await router.push(Routes.SchemaPage({ schemaId: schema.id }))
      }}
    >
      <LabeledTextField name="name" label="Name" />
      <button type="submit">Create</button>
    </Form>
  )
}

const NewSchemaPage: BlitzPage = () => {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <NewSchema />
    </Suspense>
  )
}

export default NewSchemaPage
