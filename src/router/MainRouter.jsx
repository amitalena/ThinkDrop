import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";
import Login from "../pages/Login";
import Dashboard from "../pages/dashboard/Dashboard";

const routers = createBrowserRouter([
    {
        path: "",
        element: <PublicRoutes />,
        children: [
            {
                path: "",
                index: true,
                element: <Login />,
            },
        ],
    },
    {
        path: "dashboard",
        element: <PrivateRoutes />,
        children: [
            {
                path: "",
                index: true,
                element: <Dashboard />,
            },
        ],
    },
]);

export default function MainRouter() {
    return <RouterProvider router={routers} />;
}
