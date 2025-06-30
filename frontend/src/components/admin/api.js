// Define API endpoints
export const USER_API_END_POINT = "http://localhost:8000/api/v1/users/";
export const JOB_API_END_POINT = "http://localhost:8000/api/v1/jobs/";
export const COMPANY_API_END_POINT = "http://localhost:8000/api/v1/companies/";

// Create an axios instance with interceptors
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    withCredentials: true, // Important for cookie-based authentication
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem('token') ||
            document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor for handling authentication errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
        });

        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// User APIs
export const getAllUsers = async () => {
    try {
        const response = await api.get('users/');
        return response.data;
    } catch (error) {
        console.error("Detailed Users Fetch Error:", error.response?.data || error.message);
        throw error;
    }
};

// export const addUser = async (userData) => {
//     try {
//         const response = await api.post('users/', userData);
//         return response.data;
//     } catch (error) {
//         console.error("Error adding user:", error);
//         throw error;
//     }
// };
export const addUser = async (formData) => {
    try {
        const response = await api.post('users/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }, // Ensure this header is set
            withCredentials:true
        });
        
        return response.data;
    } catch (error) {
        console.error("Error in addUser API:", error);
        throw error;
    }
};

export const removeUser = async (userId) => {
    try {
        const response = await api.delete(`users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing user:", error);
        throw error;
    }
};

// Job APIs
export const getAllJobs = async () => {
    try {
        const response = await api.get('jobs/');
        return response.data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
    }
};

export const removeJob = async (jobId) => {
    try {
        const response = await api.delete(`jobs/${jobId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing job:", error);
        throw error;
    }
};

// Company APIs
export const getAllCompanies = async () => {
    try {
        const response = await api.get('companies/');
        return response.data;
    } catch (error) {
        console.error("Error fetching companies:", error);
        throw error;
    }
};

export const addCompany = async (companyData) => {
    try {
        const response = await api.post('companies/', companyData);
        return response.data;
    } catch (error) {
        console.error("Error adding company:", error);
        throw error;
    }
};

export const acceptOrRejectCompany = async (companyId, action) => {
    try {
        const response = await api.put(`companies/${companyId}/${action}`);
        return response.data;
    } catch (error) {
        console.error("Error accepting/rejecting company:", {
            message: error.message,
            responseData: error.response?.data,
            responseStatus: error.response?.status,
        });
        throw error;
    }
};

export const removeCompany = async (companyId) => {
    try {
        const response = await api.delete(`companies/${companyId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing company:", error);
        throw error;
    }
};

export default api;