import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./Pages/Signup"
import Navbar from "./components/Navbar"
import { Toaster } from "react-hot-toast"
import useAuthStore from "./store/useAuthStore"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner"
import AdminPage from "./pages/AdminPage"



function App() {
  const { authUser, checkAuth, authChecking } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (authChecking) return <LoadingSpinner />
  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
      {/* Background gradient */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
        </div>
      </div>

      <div className='relative z-50 pt-20'>
        <Navbar />
        <Routes>

          <Route path="/" element={authUser ? <Home /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to={"/"} />} />
          <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to={"/"} />} />
          <Route path="/secret-dashboard" element={authUser && authUser?.role ==="admin" ? <AdminPage /> : <Navigate to={"/login"} />} />
          

        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App
