// Define the shape of the authentication state
export interface AuthState {
    user: {
        id?: string;
        email?: string;
        role?: 'ARTIST' | 'COLLECTOR';
        firstName?: string;
        lastName?: string;
        profilePhoto?: string;
    } | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Define the shape of the login request payload
export interface LoginRequest {
    email: string;
    password: string;
}

// Define the shape of the register request payload
export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'ARTIST' | 'COLLECTOR';
    profilePhoto?: File | string; // Optional, can be a File for uploads or a URL
}

// Define the shape of the authentication response from the API
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: 'ARTIST' | 'COLLECTOR';
        firstName: string;
        lastName: string;
        profilePhoto?: string;
    };
}