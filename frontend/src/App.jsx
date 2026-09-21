import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import APIs from "./pages/APIs";
import APIKeys from "./pages/APIKeys";
import Monitoring from "./pages/Monitoring";


const App = () => {

    return (

        <BrowserRouter>

            <Routes>

                {/* Login */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* Register */}

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Dashboard */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                {/* APIs */}

                <Route
                    path="/apis"
                    element={<APIs />}
                />


                {/* API Keys */}

                <Route
                    path="/keys"
                    element={<APIKeys />}
                />


                {/* Monitoring */}

                <Route
                    path="/monitoring"
                    element={<Monitoring />}
                />


                {/* Default */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );
};


export default App;