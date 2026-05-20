import { createContext, useState } from "react"

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
  const [aToken, setaToken] = useState('')
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const value = {
    aToken,
    setaToken,
    backendUrl,
  }

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider
