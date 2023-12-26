import './App.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
  const token = useAuthStore((store) => store.token);
  const setToken = useAuthStore((store) => store.setToken);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken || !token) {
      navigate('/register', { replace: true });
    } else {
      setToken(storedToken);
    }
  }, [token, navigate]);

  return (
    <>
      <div className="text-2xl h-14 flex items-center justify-center text-center font-bold dark:bg-slate-800 dark:text-white border-b border-stone-500 dark:border-[#282976]">
        <h1 className="font-mono">User Dashboard</h1>
      </div>
      <Outlet />
    </>
  );
}

export default App;
