import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import ApiManagement from "./pages/ApiManagement";

import ApiKeys from "./pages/ApiKeys";

import Monitoring from "./pages/Monitoring";


const ProtectedRoute = ({ children }) => {

    const token =
        localStorage.getItem("token");


    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return children;
};


const App = () => {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />


                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/apis"
                    element={
                        <ProtectedRoute>
                            <ApiManagement />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/apis/:apiId/keys"
                    element={
                        <ProtectedRoute>
                            <ApiKeys />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/monitoring"
                    element={
                        <ProtectedRoute>
                            <Monitoring />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
};


export default App;