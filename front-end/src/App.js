
import React from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Home from "./components/Home";
import Navbar from './components/Navbar';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import Logout from "./components/Logout";

import './App.css';

const App = () => {
  let routes = useRoutes([
    { path:"/", element: <LoginForm />},
    { path:"/login", element: <LoginForm />},
    { path:"/register", element: <RegisterForm />},
    { path:"/home", element: <Home /> },
    { path:"/logout", element: <Logout /> },
  ]);
  return routes;
};


const AppWrapper = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;
