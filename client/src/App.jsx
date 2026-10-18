import { useState } from 'react'

import './App.css'
import { Routes,Route } from 'react-router-dom'
import DashboardLayout from './layout/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Devices from './pages/dashboard/Devices'
import Room from './pages/dashboard/Room'
import EnergyAnalytics from './pages/dashboard/EnergyAnalytics'
import Setting from './pages/dashboard/Setting'

function App() {
  

  return (
    <>
    <Routes>
      <Route path='/' element={<DashboardLayout/>}>
        <Route index element={<Overview/>}/>
        <Route path='/devices' element={<Devices/>}/>
        <Route path='/automation' element={<Devices/>}/>
        <Route path='/room' element={<Room/>}/>
        <Route path='/analytics' element={<EnergyAnalytics/>}/>
        <Route path='/setting' element={<Setting/>}/>
      
      </Route>
    </Routes>
    </>
  )
}

export default App
