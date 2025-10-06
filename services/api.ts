import axios from 'axios';

// API Configuration - UPDATE THIS WITH YOUR COMPUTER'S IP ADDRESS
const API_BASE_URL = 'http://192.168.100.100:8080'; // ⚠️ Change this to your computer's IP!

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message,
        });

        // Handle different error types
        if (error.code === 'ECONNREFUSED') {
            console.error('🔌 Cannot connect to API server. Make sure:');
            console.error('   1. Backend is running: uvicorn main:app --reload');
            console.error('   2. Correct IP address in services/api.ts');
            console.error('   3. Phone and computer on same WiFi');
        }

        return Promise.reject(error);
    }
);

// =============================================================================
// API SERVICES
// =============================================================================

/**
 * Analysis API - For skin image analysis and history
 */
export const analysisAPI = {
    /**
     * Upload a skin image for analysis
     */
    uploadImage: async (imageUri: string, metadata: any = {}) => {
        const formData = new FormData();

        // Append the image file
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'skin_analysis.jpg',
        } as any);

        // Append metadata
        formData.append('metadata', JSON.stringify({
            timestamp: new Date().toISOString(),
            ...metadata
        }));

        const response = await api.post('/api/v1/analysis/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 45000, // 45 seconds for image analysis
        });

        return response.data;
    },

    /**
     * Get user's analysis history with optional filters
     */
    getHistory: async (filters?: { status?: string; search?: string }) => {
        const response = await api.get('/api/v1/analysis/history', {
            params: filters
        });
        return response.data;
    },
};

/**
 * Treatment API - For treatment plans and management
 */
export const treatmentAPI = {
    /**
     * Get all treatments for the current user
     */
    getTreatments: async () => {
        const response = await api.get('/api/v1/treatments');
        return response.data;
    },

    /**
     * Update treatment completion status
     */
    updateTreatment: async (treatmentId: string, completed: boolean) => {
        const response = await api.put(`/api/v1/treatments/${treatmentId}`, {
            completed,
        });
        return response.data;
    },
};

/**
 * User API - For user profile and settings
 */
export const userAPI = {
    /**
     * Get current user profile
     */
    getCurrentUser: async () => {
        const response = await api.get('/api/v1/users/me');
        return response.data;
    },
};

/**
 * Health API - For checking server status
 */
export const healthAPI = {
    /**
     * Check if API server is healthy
     */
    check: async () => {
        const response = await api.get('/api/v1/health');
        return response.data;
    },
};

/**
 * Diseases API - For getting disease information
 */
export const diseasesAPI = {
    /**
     * Get information about all detectable diseases
     */
    getAll: async () => {
        const response = await api.get('/api/v1/diseases');
        return response.data;
    },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Test the connection to the API server
 */
export const testConnection = async (): Promise<boolean> => {
    try {
        console.log('🔌 Testing API connection...');
        const response = await healthAPI.check();
        console.log('✅ API Connection successful:', response);
        return true;
    } catch (error: any) {
        console.log('❌ API Connection failed:', {
            message: error.message,
            code: error.code,
            url: API_BASE_URL,
        });

        // Provide helpful error messages
        if (error.code === 'ECONNREFUSED') {
            console.log(`
🔧 TROUBLESHOOTING:
1. Make sure your FastAPI server is running:
   cd backend && uvicorn main:app --reload

2. Check your computer's IP address:
   - Windows: ipconfig
   - Mac/Linux: ifconfig
   Look for IPv4 address (192.168.x.x or 10.0.x.x)

3. Update API_BASE_URL in services/api.ts with your IP

4. Ensure phone and computer are on same WiFi network

Current API_BASE_URL: ${API_BASE_URL}
      `);
        }

        return false;
    }
};

/**
 * Get API configuration info
 */
export const getAPIConfig = () => ({
    baseURL: API_BASE_URL,
    isConfigured: API_BASE_URL !== 'http://192.168.100.100:8080',
});

/**
 * Format error message for user display
 */
export const formatErrorMessage = (error: any): string => {
    if (error.response?.data?.detail) {
        return error.response.data.detail;
    }

    if (error.code === 'ECONNREFUSED') {
        return 'Cannot connect to server. Check your connection and server status.';
    }

    if (error.message?.includes('timeout')) {
        return 'Request timed out. Please try again.';
    }

    return error.message || 'An unexpected error occurred';
};

// =============================================================================
// TYPES (Optional - for better TypeScript support)
// =============================================================================

export interface AnalysisResult {
    id: string;
    condition: string;
    condition_name: string;
    confidence: number;
    confidence_percentage: number;
    severity: string;
    description: string;
    recommendations: string[];
    timestamp: string;
    model_used?: string;
}

export interface Treatment {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes: string;
    completed: boolean;
}

export interface User {
    id: string;
    email: string;
    name: string;
    skin_type: string;
}

export interface DiseaseInfo {
    code: string;
    name: string;
    description: string;
    severity: string;
    recommendations: string[];
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

