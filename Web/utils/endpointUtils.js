import api from "./apiUtils";

/**
 * Helper para fazer GET requests com fallback
 * @param {string} endpoint - Endpoint da API
 * @param {any} fallback - Valor de fallback se erro (default: null)
 * @returns {Promise<any>}
 */
export async function safeGet(endpoint, fallback = null) {
    try {
        const response = await api.get(endpoint)
        return response.data
    } catch (error) {
        console.error(`❌ [safeGet] Error fetching ${endpoint}:`, error.response?.data || error.message)
        return fallback
    }
}

/**
 * Helper para fazer POST requests com error handling
 * @param {string} endpoint - Endpoint da API
 * @param {any} data - Dados a enviar
 * @returns {Promise<any>}
 */
export async function safePost(endpoint, data) {
    try {
        const response = await api.post(endpoint, data)
        return { success: true, data: response.data }
    } catch (error) {
        console.error(`❌ [safePost] Error posting to ${endpoint}:`, error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || error.message
        }
    }
}

/**
 * Helper para fazer PUT requests com error handling
 * @param {string} endpoint - Endpoint da API
 * @param {any} data - Dados a enviar
 * @returns {Promise<any>}
 */
export async function safePut(endpoint, data) {
    try {
        const response = await api.put(endpoint, data)
        return { success: true, data: response.data }
    } catch (error) {
        console.error(`❌ [safePut] Error updating ${endpoint}:`, error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || error.message
        }
    }
}

/**
 * Helper para fazer DELETE requests com error handling
 * @param {string} endpoint - Endpoint da API
 * @returns {Promise<any>}
 */
export async function safeDelete(endpoint) {
    try {
        const response = await api.delete(endpoint)
        return { success: true, data: response.data }
    } catch (error) {
        console.error(`❌ [safeDelete] Error deleting ${endpoint}:`, error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || error.message
        }
    }
}