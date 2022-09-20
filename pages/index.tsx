import React, { Suspense } from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Routes, BlitzPage } from "@blitzjs/next"
import Link from "next/link"

import logout from "app/auth/mutations/logout"
import getSchemas from "../app/schemas/queries/getSchemas"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const Schemas: React.FC = () => {
  const [schemas] = useQuery(getSchemas, undefined)

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {schemas.map((schema) => (
          <tr key={schema.id}>
            <td>{schema.id}</td>
            <td>{schema.name}</td>
            <td>
              <Link href={Routes.SchemaPage({ schemaId: schema.id })}>
                <button>Open</button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <div>
          <button
            className="button small"
            onClick={async () => {
              await logoutMutation()
            }}
          >
            Logout
          </button>
          <Link href={Routes.NewSchemaPage()}>New schema</Link>
        </div>

        <Suspense fallback={<h1>Loading...</h1>}>
          <Schemas />
        </Suspense>
      </>
    )
  } else {
    return (
      <>
        <Link href={Routes.SignupPage()}>
          <a className="button small">
            <strong>Sign Up</strong>
          </a>
        </Link>
        <Link href={Routes.LoginPage()}>
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link>
      </>
    )
  }
}

const Home: BlitzPage = () => {
  return (
    <Suspense fallback="Loading...">
      <UserInfo />
    </Suspense>
  )
}

export default Home
