export interface User {
  id: string;
  username: string;
}

export interface AuthPayload {
  accessToken: string;
  user: User;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface SignUpInput {
  name: string;
  lastName: string;
  username: string;
  password: string;
}
