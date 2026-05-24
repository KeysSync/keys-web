export interface AuthUser {
  id: string;
  email: string;
  level: number;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
