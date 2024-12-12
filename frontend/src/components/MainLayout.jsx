import { Outlet } from 'react-router-dom'
import React from 'react'
import LeftSidebar from './LeftSidebar'
import Header from './Header';
const MainLayout = () => {
  return (

    <div>
    <LeftSidebar/>
    <div>
    <Header/>
      <Outlet/>
    </div>
    </div>
  )
}
export default MainLayout
