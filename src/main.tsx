import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {NewAccount} from "./NewAccount.tsx";
import {Home} from "./Home.tsx";
import {AccountView} from "./AccountView.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "new-account",
                element: <NewAccount/>
            },
            {
                path: "accounts/:accountNumber",
                element: <AccountView/>
            },
            {
                path: "/",
                element: <Home/>
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
