import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { User, UserLogin, UserRegister } from "./types/user";
import { createContext } from "react";
import { ServiceProps } from "@/components/Services/ServiceCard";

export const queryClient = new QueryClient();
export const userContext = createContext<{
  currentUser: User | null;
  login: (res: any) => void;
}>({ currentUser: null, login: () => {} });
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

export class ApiClient {
  private static getToken() {
    return sessionStorage.getItem("token");
  }
  static async getTest() {
    return axiosInstance.get("/test", {}).then((res) => console.log(res));
  }
  static async getTestAuth() {
    return axiosInstance
      .get("/test_auth", {
        headers: {
          Authorization: this.getToken(),
        },
      })
      .then((res) => {
        console.log(res);
        return res;
      });
  }
  static async login(user: UserLogin) {
    queryClient.invalidateQueries({ queryKey: ["token_validity"] });
    queryClient.invalidateQueries({ queryKey: ["me"] });
    const query = queryClient.fetchQuery({
      queryKey: ["token_validity"],
      queryFn: async () => {
        const { data, headers } = await axiosInstance.post("/login", {
          user,
        });
        sessionStorage.setItem("token", headers.authorization);
        return data;
      },
    });
    return query;
  }

  static async register(user: UserRegister) {
    return axiosInstance.post("/signup", { user }).then((res) => res);
  }

  static async me() {
    return axiosInstance
      .get("/me", {
        headers: {
          Authorization: this.getToken(),
        },
      })
      .then((res) => {
        return res.data;
      });
  }

  static async logout() {
    const query = queryClient.fetchQuery({
      queryKey: ["token_validity"],
      queryFn: async () => {
        const { data } = await axiosInstance.delete("/logout", {
          headers: {
            Authorization: this.getToken(),
          },
        });
        return data;
      },
    });
    sessionStorage.removeItem("token");
    return query;
  }

  static async getUsers(number?: number) {
    return axiosInstance
      .get<User[]>(`/users${number ? `?number=${number}` : ""}`, {
        headers: {
          Authorization: this.getToken(),
        },
      })
      .then((res) => res.data);
  }
  static async getClients() {
    return axiosInstance.get<User[]>(`/clients`, {
      headers: {
        Authorization: this.getToken(),
      },
    });
  }
  static async getUser(id: number) {
    return axiosInstance
      .get<User>(`/users/${id}`, {
        headers: {
          Authorization: this.getToken(),
        },
      })
      .then((res) => res);
  }
  static async updateUser(id: number, user: User) {
    const userUpdate = { ...user };
    return axiosInstance.put(
      `/users/${id}`,
      { user: userUpdate },
      {
        headers: {
          Authorization: this.getToken(),
        },
      }
    );
  }
  static async confirmRegistration(confirmationToken: string) {
    return axiosInstance
      .get("/confirmation", {
        params: {
          confirmation_token: confirmationToken,
        },
      })
      .then((res) => {
        console.log(res, "res");
        return res;
      });
  }
  static async deleteUser(id: number) {
    return axiosInstance.delete(`/users/${id}`, {
      headers: {
        Authorization: this.getToken(),
      },
    });
  }

  static async getPermissions() {
    return axiosInstance.get(`/permissions`, {
      headers: {
        Authorization: this.getToken(),
      },
    });
  }
  static async getAppointments() {
    return axiosInstance.get<TAppointment[]>(`/appointments`, {
      headers: {
        Authorization: this.getToken(),
      },
    });
  }
  static async getServices() {
    return axiosInstance.get<ServiceProps["service"][]>(`/services`, {
      headers: {
        Authorization: this.getToken(),
      },
    });
  }

  static async getPosts(params?: getPostsParams) {
    return axiosInstance.get(`/posts`, {
      headers: {
        Authorization: this.getToken(),
      },
      params: params,
    });
  }
  static async getPost(id: number) {
    return axiosInstance.get(`/posts/${id}`, {
      headers: {
        Authorization: this.getToken(),
      },
    });
  }
  static async createPost(post: FormData) {
    return axiosInstance.postForm(`/posts`, post, {
      headers: {
        Authorization: this.getToken(),
      },
    });
  }

  static async updatePost(id: number, post: FormData) {
    return axiosInstance.putForm(`/posts/${id}`, post, {
      headers: {
        Authorization: this.getToken(),
      },
    });
  }
  static async getImages(limit?: number) {
    return axiosInstance.get(`/images?limit=${limit}`, {
      headers: {
        Authorization: this.getToken(),
      },
    });
  }
  static async getEmployees() {
    return axiosInstance
      .get<User[]>(`/employees`, {
        headers: {
          Authorization: this.getToken(),
        },
      })
      .then((res) => res);
  }
  static patch = (url: string, data: any) =>
    axiosInstance.patch(url, data, {
      headers: {
        Authorization: this.getToken(),
      },
    });
  static delete = (url: string) =>
    axiosInstance.delete(url, {
      headers: {
        Authorization: this.getToken(),
      },
    });
  static post = (url: string, data: any) =>
    axiosInstance.post(url, data, {
      headers: {
        Authorization: this.getToken(),
      },
    });
}
export type getPostsParams = { limit?: number };
