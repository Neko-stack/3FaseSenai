import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Home } from './pages/Home';
import { Sobre } from './pages/Sobre';
import { Main } from './layouts/Main';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Blog from './pages/Blog';
import Autores from './pages/Autores/index'
import PostDetail from './pages/Blog'
import Details from './pages/Autores/Details'



const router = createBrowserRouter([
  {
    element: <Main />,
    children: [
      {
        path: "/", element: <Home />
      },
      {
        path: "sobre", element: <Sobre />
      },
      {
        path: "blog", element: <Blog />
      },
      {
        path: "autores", element: <Autores />
      },
      {
        path: "/post/:id", element: <PostDetail />
      },
      {
        path: '/',
        element: <Autores />,
      },
      {
        path: '/autor/:id',
        element: <Details />,
      },
    ]
  },
  {
    path: "login",
    element: <Login />
  }
  // {
  //   path: "/",
  //   element: <Home/>,
  // },
  // {
  //   path: "/sobre",
  //   element: <Sobre/>,
  // },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Route path="/" element={<Autores />} />
      <Route path="/autor/:id" element={<Details />} />
    </AuthProvider>
    {/* <App /> */}
  </StrictMode>,
)
