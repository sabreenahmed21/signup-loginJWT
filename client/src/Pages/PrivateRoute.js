import React from 'react'
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute() {
  const { currentUser} = useSelector((state) => state.user);
  return (
    currentUser ? <Outlet/> : <h3>You must log in to display this page</h3>
  )
}
