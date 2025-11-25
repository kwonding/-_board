// auth.type.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expireTime: number; // 초 단위
}