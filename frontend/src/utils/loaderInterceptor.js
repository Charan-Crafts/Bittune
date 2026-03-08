import adminApi from "../api/adminApi";
import songApi from "../api/songApi";
import authApi from "../api/userApi";

export const setupLoaderInterceptors = (showLoader, hideLoader) => {
  const apis = [adminApi, songApi, authApi];

  const interceptors = apis.map((api) => {
    const reqId = api.interceptors.request.use(
      (config) => {
        showLoader();
        return config;
      },
      (error) => {
        hideLoader();
        return Promise.reject(error);
      }
    );

    const resId = api.interceptors.response.use(
      (response) => {
        hideLoader();
        return response;
      },
      (error) => {
        hideLoader();
        return Promise.reject(error);
      }
    );

    return { api, reqId, resId };
  });

  // Return cleanup function to eject interceptors
  return () => {
    interceptors.forEach(({ api, reqId, resId }) => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    });
  };
};
