import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken || token) {
      navigate('/');
    }
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      setToken(res.data['access_token']);
      localStorage.setItem('token', res.data['access_token']);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className={`w-96 h-80 border px-6 box-border border-stone-500 dark:border-[#6366f1] rounded-lg mx-auto mt-8 dark:bg-slate-800 dark:text-white}`}
      >
        <h4 className="text-xl text-center dark:text-white mb-5 mt-2 font-semibold">
          Login
        </h4>
        <input
          value={email}
          onChange={handleEmail}
          className="dark:text-white outline outline-stone-500 dark:bg-slate-800 mt-2 w-full h-9 pl-2 dark:outline dark:outline-[#6366f1] rounded-sm"
          type="email"
          placeholder="Enter your email"
          required
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="dark:text-white outline outline-stone-500 dark:bg-slate-800 mt-4 w-full h-9 pl-2 dark:outline dark:outline-[#6366f1] rounded-sm"
          type="password"
          placeholder="Enter your password"
          required
        />
        <br />
        <button
          className=" w-full dark:border dark:border-[#6366f1] mt-6 h-10 rounded-md hover:bg-stone-500 border border-stone-500 hover:text-white dark:hover:bg-cyan-700"
          type="submit"
        >
          Submit
        </button>
        <p className="text-center mt-4">
          Don&apos;t have an account?
          <Link to="/register" className="text-blue-600 ml-2">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
