export class ApiError extends Error {
  constructor(message: string) {
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
