import { AxiosError } from "axios";

import { api } from "./instance";
import { ApiError, type IGetRowsParams, type IUser } from "./types";

export const getRows = async (params: IGetRowsParams): Promise<IUser[]> => {
  try {
    const { data } = await api.get<IUser[]>("/users", {
      params,
    });
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const userMessage =
        error.response?.data?.message || "Произошла ошибка при загрузке данных";

      throw new ApiError(userMessage, error.response?.status, error);
    } else {
      throw new ApiError("Неизвестная ошибка", undefined, error);
    }
  }
};
