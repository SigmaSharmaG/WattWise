import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/ui/Sidebar'
import Header from '../components/ui/Header'


const DashboardLayout = () => {
  return (
    <div className='min-h-screen flex bg-gray-100'>
        {/* Sidebar */}
        <Sidebar/>
        <main className='flex-1 min-w-0 flex flex-col'>
            {/* Topbar */}
            <Header/>
            <Outlet/>
        </main>
    </div>
  )
}

export default DashboardLayout