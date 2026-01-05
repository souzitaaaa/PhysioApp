import api from "./apiUtils";

// Helper for GET requests with fallback
export async function safeGet(endpoint, fallback = null) {
    try {
        const response = await api.get(endpoint)
        return response.data
    } catch (error) {
        console.error(` [safeGet] Error fetching ${endpoint}:`, error.response?.data || error.message)
        return fallback
    }
}

// Helper for POST requests with error handling
export async function safePost(endpoint, data) {
    try {
        const response = await api.post(endpoint, data)
        return { success: true, data: response.data }
    } catch (error) {
        console.error(` [safePost] Error posting to ${endpoint}:`, error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || error.message
        }
    }
}

// Helper for PUT requests with error handling
export async function safePut(endpoint, data) {
    try {
        const response = await api.put(endpoint, data)
        return { success: true, data: response.data }
    } catch (error) {
        console.error(` [safePut] Error updating ${endpoint}:`, error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || error.message
        }
    }
}

// Helper for DELETE requests with error handling
export async function safeDelete(endpoint) {
    try {
        const response = await api.delete(endpoint)
        return { success: true, data: response.data }
    } catch (error) {
        console.error(` [safeDelete] Error deleting ${endpoint}:`, error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || error.message
        }
    }
}