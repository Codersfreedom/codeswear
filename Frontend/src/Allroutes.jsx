import React from 'react'
import { Routes, Route } from 'react-router-dom';
import HomeMainbar from './components/HomeMainbar';
import Signup from './Pages/Signup';
import Login from './Pages/Login';

const Allroutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomeMainbar />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />

    </Routes>
  )
}

export default Allroutes
