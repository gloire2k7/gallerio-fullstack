export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    email: string;
    role?: string;
    bio?: string;
    location?: string;
    profilePictureUrl?: string;
    phoneNumber?: string;
    socialMediaLinks?: string[];
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    bio?: string;
    location?: string;
    profilePictureUrl?: string;
    phoneNumber?: string;
    socialMediaLinks?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
} 