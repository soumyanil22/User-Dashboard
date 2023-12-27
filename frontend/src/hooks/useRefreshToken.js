import axios from "axios";
import { useAuthStore } from "../store/authStore";


function useRefreshToken() {
    const setToken = useAuthStore((state) => state.setToken);

    const refreshToken = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {
                withCredentials: true,
            })

            if (res.status === 200) {
                setToken(res.data.access_token);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return refreshToken;

}

export default useRefreshToken;