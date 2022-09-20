import React, { Suspense, useState } from "react"
import { BlitzPage, useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { getSchema as parseSchema, Model, createPrismaSchemaBuilder } from "@mrleebo/prisma-ast"

import getSchema from "../../../app/schemas/queries/getSchema"
import updateSchemaFn from "app/schemas/mutations/updateSchema"

type ActionType =
  | { type: "addField"; model: string; field: { name: string; type: string } }
  | { type: "deleteModel"; model: string }
  | { type: "addModel"; model: string }

const recreateSchema = (code: string, action?: ActionType) => {
  const parsed = parseSchema(code)

  let builder: any = createPrismaSchemaBuilder()
  parsed.list.forEach((item) => {
    if (item.type === "model") {
      if (action?.type === "deleteModel" && action.model === item.name) {
        return
      }

      builder = builder.model(item.name)
      item.properties.forEach((prop) => {
        if (prop.type === "field") {
          builder = builder.field(prop.name, prop.fieldType)
        }
      })

      if (action?.type === "addField" && item.name === action?.model) {
        builder = builder.field(action.field.name, action.field.type)
      }
    }
  })

  if (action?.type === "addModel") {
    builder = builder.model(action.model).field("id", "Int")
  }

  return builder.print()
}

const Schema: React.FC = () => {
  const id = useParam("schemaId", "string")!
  const [schema, { refetch }] = useQuery(getSchema, { id })

  const [initSchema, setInitSchema] = useState(recreateSchema(schema.code))

  const [code, setCode] = useState(recreateSchema(schema.code))
  const [updateSchema] = useMutation(updateSchemaFn)

  const onUpdate = async () => {
    const updatedSchema = await updateSchema({ id, data: { code } })
    setCode(recreateSchema(updatedSchema.code))
    setInitSchema(recreateSchema(updatedSchema.code))

    await refetch()
  }

  const parsed = parseSchema(code)
  const models = parsed.list.filter((item) => item.type === "model") as Model[]
  const [model, setModel] = useState<string>(models[0]!.name)

  const selectedModel = models.find((m) => m.name === model)

  const addColumn = () => {
    const name = prompt("Name")
    if (name === null) return

    const type = prompt("Type")
    if (type === null) return

    setCode(recreateSchema(code, { type: "addField", model, field: { name, type } }))
  }

  const deleteModel = () => {
    if (confirm()) {
      setCode(recreateSchema(code, { type: "deleteModel", model }))
    }
  }

  const addTable = () => {
    const name = prompt("Name")
    if (name === null) return
    setCode(recreateSchema(code, { type: "addModel", model: name }))
  }

  return (
    <div>
      <h1>{schema.name}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)" }}>
        <div style={{ gridColumnStart: 1, gridColumnEnd: 6 }}>
          <button disabled={initSchema === code} onClick={onUpdate}>
            Update
          </button>

          <code style={{ whiteSpace: "pre" }}>{code}</code>
        </div>
        <div style={{ gridColumnStart: 7, gridColumnEnd: 13 }}>
          <div style={{ display: "flex" }}>
            {models.map((m) => (
              <button
                key={m.name}
                style={{ marginRight: "4px", color: m.name === model ? "orange" : undefined }}
                onClick={() => setModel(m.name)}
              >
                {m.name}
              </button>
            ))}

            <button onClick={addTable} style={{ marginLeft: "24px" }}>
              Add Table
            </button>
          </div>

          {!selectedModel && <h1>No model selected</h1>}

          {selectedModel && (
            <>
              <div>
                <button onClick={addColumn}>Add column</button>
                <button onClick={deleteModel}>Delete model</button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Column name</th>
                    <th>Column type</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedModel.properties.map((field: any) => (
                    <tr key={field.type}>
                      <td>{field.name}</td>
                      <td>{field.fieldType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
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
