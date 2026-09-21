const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();


console.log(
    "JWT_SECRET loaded:",
    !!process.env.JWT_SECRET
);


// ==========================================
// Database
// ==========================================

require("./database/schema");


// ==========================================
// Routes
// ==========================================

const authRoutes = require(
    "./routes/authRoutes"
);

const apiRoutes = require(
    "./routes/apiRoutes"
);

const apiKeyRoutes = require(
    "./routes/apiKeyRoutes"
);

const gatewayRoutes = require(
    "./routes/gatewayRoutes"
);

const monitoringRoutes = require(
    "./routes/monitoringRoutes"
);

const healthRoutes =
    require("./routes/healthRoutes");

// ==========================================
// Middleware
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {

    res.json({
        message:
            "API Management Platform Backend Running"
    });

});


// ==========================================
// Authentication
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);


// ==========================================
// API Management
// ==========================================

app.use(
    "/api/apis",
    apiRoutes
);


// ==========================================
// API Key Management
// ==========================================

app.use(
    "/api/keys",
    apiKeyRoutes
);


// ==========================================
// API Gateway
// ==========================================

app.use(
    "/api/gateway",
    gatewayRoutes
);


// ==========================================
// Monitoring
// ==========================================

app.use(
    "/api/monitoring",
    monitoringRoutes
);

app.use(
    "/api/health",
    healthRoutes
);

// ==========================================
// Start Server
// ==========================================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);