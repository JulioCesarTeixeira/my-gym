import { getAuthToken, saveAuthToken } from "@storage/storageAuthToken";
import { AppError } from "@utils/AppError";
import axios, { AxiosError, AxiosInstance } from "axios";

type PromiseType = {
  onSucess?: (token: string) => void;
  onError?: (error: AxiosError) => void;
};

type SignOut = () => void;

type ApiInstanceProps = AxiosInstance & {
  registerInterceptorsTokenManager: (signOut: SignOut) => () => void;
};

const api = axios.create({
  baseURL: "http://127.0.0.1:3333",
}) as ApiInstanceProps;

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let failedExecutionQueue: PromiseType[] = [];
let isRefreshing = false;

api.registerInterceptorsTokenManager = (signOut) => {
  const interceptor = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      console.log(
        "interceptor error",
        requestError.response.data.message,
        requestError.response.status
      );

      // Refresh token if access token has expired
      if (requestError.response.status === 401) {
        if (
          requestError.response.data.message === "token.expired" ||
          requestError.response.data.message === "token.invalid"
        ) {
          const { refresh_token } = await getAuthToken();

          if (!refresh_token) {
            signOut();
            return Promise.reject(requestError);
          }

          const originalConfig = requestError.config;

          if (isRefreshing) {
            try {
              return new Promise((resolve, reject) => {
                // Add the new request to the queue of failed requests
                failedExecutionQueue.push({
                  onSucess: (token: string) => {
                    // Replace the expired token and retry the request with the new token
                    originalConfig.headers = {
                      Authorization: `Bearer ${token}`,
                    };
                    resolve(api(originalConfig));
                  },
                  onError: (error: AxiosError) => {
                    reject(error);
                  },
                });
              });
            } catch (error) {
              return Promise.reject(error);
            }
          }

          isRefreshing = true;

          return new Promise(async (resolve, reject) => {
            try {
              // Make api request to get new access token
              const { data } = await api.post("/sessions/refresh-token", {
                refresh_token,
              });

              if (!data) {
                signOut();
                return Promise.reject(requestError);
              }

              // Save new access token
              await saveAuthToken({
                token: data.token,
                refresh_token: data.refresh_token,
              });

              if (originalConfig.data) {
                originalConfig.data = JSON.parse(originalConfig.data);
              }

              // Update original request with new access token
              // Update common header with new access token
              originalConfig.headers = {
                Authorization: `Bearer ${data.token}`,
              };
              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.token}`;

              // Execute all the requests on the queue
              failedExecutionQueue.forEach((request) => {
                request.onSucess && request.onSucess(data.token);
              });

              console.log("UPDATED TOKEN");

              resolve(api(originalConfig));
            } catch (error) {
              reject(error);
            } finally {
              isRefreshing = false;
              failedExecutionQueue = [];
            }
          });
        }

        // If it's not possible to refresh the token, or if the refresh token has expired, sign out the user
        signOut();
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      }

      return Promise.reject(
        new AppError("Internal server error. Please try again later.")
      );
    }
  );

  return () => {
    api.interceptors.response.eject(interceptor);
  };
};

export { api };
