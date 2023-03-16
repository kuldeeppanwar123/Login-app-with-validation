import React from "react";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Username from "./components/Username.js";
import Register from "./components/Register.js";
import Reset from "./components/Reset.js";
import Recovery from "./components/Recovery.js";
import Password from "./components/Password.js";
import Profile from "./components/Profile.js";
import { AuthorizedUser, ProtectRoute } from "./middleware/auth.js";
//routes
const router = createBrowserRouter([
    {
        path:'/',
        element:<Username/>
    },
    {
        path:'/register',
        element:<Register/>
    },
    {
        path:'/recovery',
        element:<Recovery/>
    },
    {
        path:'/reset',
        element:<Reset/>
    },
    {
        path:'/password',
        element:<ProtectRoute><Password/></ProtectRoute>
    },
    {
        path:'/profile',
        element:<AuthorizedUser><Profile/></AuthorizedUser>
    }
])
export default function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
    </main>
  );
}
