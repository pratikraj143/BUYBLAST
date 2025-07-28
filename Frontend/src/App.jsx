import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import Dummy from './page/Dummy'
import Register from './page/Register'
import Home from './page/Home'
import Login from './page/Login.jsx'
import Otp from './page/Otp.jsx'
import Error from './page/Error.jsx'
import appstore from './utils/appstore.jsx'
import { Provider } from 'react-redux'
import UserProfile from './page/UserProfile.jsx'
import ListProductForm from './page/ListProductForm.jsx'
import Feedback from './page/Feedback.jsx'
import Footer from './Component/Footer.jsx'

function App() {
  return (
    <>
      <Provider store={appstore}>
        <Outlet />
        <Footer />
      </Provider>
    </>
  )
}
const appRouter = createBrowserRouter([
  {

    element: <App />,
    children: [{
      path: '/',
      element: <Dummy />
    },
    {
      path: '/signup',
      element: <Register />
    },
    {
      path: '/otp',
      element: <Otp />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/feedback',
      element: <Feedback/>
    },
    {
      path: '/profile',
      element: <UserProfile />
    },
    {
      path: '/home',
      element: <Home />
    },
    {
      path: '/sell',
      element: <ListProductForm />
    },

    ],
    errorElement: <Error />
  },

])

function root() {
  return <RouterProvider router={appRouter} />
}
export default root