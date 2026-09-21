const API_BASE_URL = "http://localhost:5000/api";


const apiRequest = async (
    endpoint,
    options = {}
) => {

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );


    const contentType =
        response.headers.get(
            "content-type"
        ) || "";


    let data;


    if (
        contentType.includes(
            "application/json"
        )
    ) {

        data = await response.json();

    } else {

        const text =
            await response.text();

        console.error(
            "Non-JSON response:",
            text
        );

        throw new Error(
            `Server returned a non-JSON response (${response.status})`
        );
    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Something went wrong"
        );
    }


    return data;
};


// ==========================================
// Authentication
// ==========================================

export const loginUser = async (
    email,
    password
) => {

    return apiRequest(
        "/auth/login",
        {
            method: "POST",

            body: JSON.stringify({
                email,
                password
            })
        }
    );
};


export const registerUser = async (
    name,
    email,
    password
) => {

    return apiRequest(
        "/auth/register",
        {
            method: "POST",

            body: JSON.stringify({
                name,
                email,
                password
            })
        }
    );
};


// ==========================================
// Token
// ==========================================

export const getToken = () => {

    return localStorage.getItem(
        "token"
    );
};


export const logoutUser = () => {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );
};


// ==========================================
// API Management
// ==========================================

export const getApis = async () => {

    const token = getToken();


    return apiRequest(
        "/apis",
        {
            method: "GET",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );
};


export const createApi = async (
    name,
    base_url,
    description
) => {

    const token = getToken();


    return apiRequest(
        "/apis",
        {
            method: "POST",

            headers: {
                Authorization:
                    `Bearer ${token}`
            },

            body: JSON.stringify({
                name,
                base_url,
                description
            })
        }
    );
};


export const updateApi = async (
    id,
    name,
    base_url,
    description
) => {

    const token = getToken();


    return apiRequest(
        `/apis/${id}`,
        {
            method: "PUT",

            headers: {
                Authorization:
                    `Bearer ${token}`
            },

            body: JSON.stringify({
                name,
                base_url,
                description
            })
        }
    );
};


export const deleteApi = async (
    id
) => {

    const token = getToken();


    return apiRequest(
        `/apis/${id}`,
        {
            method: "DELETE",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );
};


// ==========================================
// API Key Management
// ==========================================

export const getApiKeys = async (
    apiId
) => {

    const token = getToken();


    return apiRequest(
        `/keys/${apiId}`,
        {
            method: "GET",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );
};


export const generateApiKey = async (
    apiId
) => {

    const token = getToken();


    return apiRequest(
        `/keys/${apiId}`,
        {
            method: "POST",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );
};


export const revokeApiKey = async (
    apiId,
    keyId
) => {

    const token = getToken();


    return apiRequest(
        `/keys/${apiId}/${keyId}`,
        {
            method: "DELETE",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );
};


// ==========================================
// Monitoring
// ==========================================

export const getApiStatistics = async (
    apiId
) => {

    const token = getToken();


    return apiRequest(
        `/monitoring/api/${apiId}`,
        {
            method: "GET",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );
};


// ==========================================
// API Health
// ==========================================

export const getApiHealth = async (
    apiId
) => {

    const token = getToken();


    return apiRequest(
        `/health/api/${apiId}`,
        {
            method: "GET",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );
};