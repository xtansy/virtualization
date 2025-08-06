export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
  }
}

export interface IGetRowsParams {
  _start: number;
  _end?: number;
  _limit?: number; // size
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  age: number;
  isActive: boolean;
  lastLogin: string;
  premium: boolean;
  postsCount: number;
}
