import axios from "axios";

const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

const setUserId = (userId: string) => {
    axiosInstance.interceptors.request.use(
        config => {
            if (userId) {
                config.headers['User-Id'] = userId;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        },
    );
};

export default axiosInstance;
export { setUserId };