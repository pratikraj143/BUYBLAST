import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import Dummy from './page/Dummy'
import Register from './page/Register'
import Home from './page/Home'
import Login from './page/Login.jsx'
import Otp from './page/Otp.jsx'
import Error from './page/Error.jsx'
import TestRoute from './page/TestRoute.jsx'
import appstore from './utils/appstore.jsx'
import { Provider } from 'react-redux'
import UserProfile from './page/UserProfile.jsx'
import ListProductForm from './page/ListProductForm.jsx'
import Feedback from './page/Feedback.jsx'
import Footer from './Component/Footer.jsx'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import Notification from './Component/Notification.jsx'
import AuthInitializer from './utils/AuthInitializer.jsx'

function App() {
  return (
    <>
      <Provider store={appstore}>
        <AuthInitializer>
          <Notification />
          <Outlet />
          <Footer />
        </AuthInitializer>
      </Provider>
    </>
  )
}
const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dummy />
      },
      {
        path: 'signup',
        element: <Register />
      },
      {
        path: 'otp',
        element: <Otp />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'test',
        element: <TestRoute />
      },
      {
        path: 'feedback',
        element: <Feedback/>
      },
      {
        path: 'profile',
        element: <ProtectedRoute><UserProfile /></ProtectedRoute>
      },
      {
        path: 'home',
        element: <ProtectedRoute><Home /></ProtectedRoute>
      },
      {
        path: 'sell',
        element: <ProtectedRoute><ListProductForm /></ProtectedRoute>
      },
      {
        path: '*',
        element: <Error />
      }
    ],
    errorElement: <Error />
  }
])

function root() {
  return <RouterProvider router={appRouter} />
}
export default root