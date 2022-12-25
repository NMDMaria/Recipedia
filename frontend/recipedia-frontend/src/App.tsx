import * as React from "react";
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StartPage from "./pages/StartPage";
import IngredientsPage from "./pages/IngredientsPage";

import "./App.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <StartPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/ingredients",
    element: <IngredientsPage/>
  }
]);

const App: React.FC = () => {
  return (
    <RouterProvider router={router} />
    );
};

export default App;
