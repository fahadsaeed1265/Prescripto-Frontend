import { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const AppContext = createContext()

const AppContextProvider = (props) => {

  const currencySymbol = "Rs."
  const backendUrl = "https://localhost:7244"
  const [doctors, setDoctors] = useState([])
  const navigate = useNavigate()

  const fetchDoctors = async () => {
    try {
      // 👇 No token needed — doctors are public
      const response = await fetch(backendUrl + "/api/doctors")

      if (response.status === 401) {
        localStorage.clear()
        navigate('/login')
        return
      }

      const data = await response.json()
      setDoctors(data)

    } catch (error) {
      console.error("Failed to load doctors:", error)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const value = {
    doctors,
    currencySymbol,
    backendUrl,
    fetchDoctors
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider