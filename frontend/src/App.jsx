import './App.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import useNetworkStatus from './hooks/useNetworkStatus';
import { useToastStore } from './store/toastStore';
import Toast from './Toast';
import axios from 'axios';
import useAuthRedirect from './hooks/useAuthRedirect';

function App() {
  const [token, setToken, tokenExpired] = useAuthStore((store) => [
    store.token,
    store.setToken,
    store.tokenExpired,
  ]);
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();
  const [show, hide] = useToastStore((state) => [state.show, state.hide]);

  useAuthRedirect();

  const refreshToken = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/refresh`, {
        withCredentials: true,
      });

      localStorage.setItem('token', res.data.access_token);
      setToken(res.data.access_token);
      show('Token refreshed successfully');
      setTimeout(() => {
        hide();
      }, 3000);
    } catch (error) {
      console.error(error);
      show('Failed to refresh token, Login again!');
      setTimeout(() => {
        hide();
      }, 3000);
    }
  };

  useEffect(() => {
    if (tokenExpired) {
      localStorage.removeItem('token');
      refreshToken();
    }

    if (!isOnline) {
      show('You are offline');

      setTimeout(() => {
        hide();
      }, [3000]);
    }
  }, [token, tokenExpired, navigate]);

  return (
    <>
      <Toast />
      <div className="text-2xl h-14 flex items-center justify-center text-center font-bold dark:bg-slate-800 dark:text-white border-b border-stone-500 dark:border-[#282976]">
        <h1 className="font-mono">User Dashboard</h1>
      </div>
      <Outlet />
    </>
  );
}

export default App;
