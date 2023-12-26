import './App.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import useNetworkStatus from './hooks/useNetworkStatus';
import { useToastStore } from './store/toastStore';
import Toast from './Toast';

function App() {
  const token = useAuthStore((store) => store.token);
  const setToken = useAuthStore((store) => store.setToken);
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();
  const [show, hide] = useToastStore((state) => [state.show, state.hide]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken || !token) {
      navigate('/register', { replace: true });
    }

    setToken(storedToken);
    navigate('/dashboard', { replace: true });

    if (!isOnline) {
      show('You are offline');

      setTimeout(() => {
        hide();
      }, [3000]);
    }
  }, [token, navigate]);

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
