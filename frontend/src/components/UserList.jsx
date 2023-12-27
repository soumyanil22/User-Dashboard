import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useToastStore } from '../store/toastStore';
import { useUserListStore } from '../store/userlist';
import { useAuthStore } from '../store/authStore';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuthRedirect from '../hooks/useAuthRedirect';

const UserList = () => {
  const show = useToastStore((store) => store.show);
  const hide = useToastStore((store) => store.hide);
  const userList = useUserListStore((store) => store.userList);
  const setUserList = useUserListStore((store) => store.setUserList);
  const [token, setTokenExpired, tokenExpired] = useAuthStore((store) => [
    store.token,
    store.setToken,
    store.setTokenExpired,
    store.tokenExpired,
  ]);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);
  const refreshToken = useRefreshToken();

  useAuthRedirect();

  const fetchUserList = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/userlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserList(res.data.list.userList);
    } catch (error) {
      console.error(error);
      if (error.response.data.error.includes('jwt expired')) {
        localStorage.removeItem('token');
        setTokenExpired(true);
      }
      show('Something went wrong');
      setTimeout(() => {
        hide();
      }, 3000);
    }
  };

  const handleFormSave = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/userlist`,
        {
          username,
          email,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.user) setUserList(...UserList, res.data.user);
      show('User created successfully');
      setTimeout(() => {
        hide();
      }, 3000);
      setIsLoading(false);
      formRef.current.reset();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      show('Something went wrong');
      setTimeout(() => {
        hide();
      }, 3000);
    }
  };

  useEffect(() => {
    if (tokenExpired) {
      refreshToken();
    }
  }, [tokenExpired]);

  useEffect(() => {
    if (token) {
      fetchUserList();
    }
  }, [token]);

  return (
    <>
      <button
        disabled={showForm}
        onClick={() => setShowForm(true)}
        className="fixed h-12 disabled:dark:bg-slate-800 disabled:shadow-none disabled:hover:border-slate-500 disabled:hover:text-white hover:shadow-blue-600 dark:hover:border-amber-300 hover:shadow-md dark:hover:shadow-amber-300 flex justify-center items-center w-36 top-8 right-6 dark:hover:text-amber-300 ml-10 border border-stone-500 rounded-md"
      >
        <span className="relative -left-1 -top-[1px] font-bold text-xl">+</span>
        Create User
      </button>
      {userList.length > 0 && (
        <div className="mt-28 w-full box-border">
          <div>
            <p className="text-xl font-bold mb-10">User List</p>
          </div>
          <div className="grid grid-cols-4 gap-4 px-4 font-semibold underline underline-offset-4 items-center justify-around box-border">
            <p>Username</p>
            <p>Email</p>
            <p>Phone</p>
            <p>Action</p>
          </div>
          {userList.length > 0 &&
            userList.map(({ _id, username, email, phone }) => (
              <div
                key={_id}
                className="mt-4 grid grid-cols-4 gap-4 px-4 items-center justify-around box-border"
              >
                <p>{username}</p>
                <p>{email}</p>
                <p>{phone}</p>
                <button className="h-8 disabled:dark:bg-slate-800 hover:shadow-blue-600 dark:hover:border-amber-300 hover:shadow-md dark:hover:shadow-amber-300 flex justify-center items-center w-36 dark:hover:text-amber-300 ml-10 border border-stone-500 rounded-md">
                  View Details
                </button>
              </div>
            ))}
        </div>
      )}
      {userList.length === 0 && (
        <>
          <div className="flex justify-center items-center h-[100vh]">
            <h1 className="text-2xl font-bold">No Data found</h1>
          </div>
        </>
      )}
      {showForm && (
        <div className="fixed box-border top-1/2 transform -translate-y-1/2 left-1/2 border rounded-md shadow-lg shadow-stone-600 dark:shadow-amber-300 border-stone-600 dark:border-amber-300 z-50 dark:bg-slate-800 bg-white">
          <form ref={formRef} className="w-96 box-border h-[440px] px-4">
            <label className="mt-4 block w-full">
              <span className="after:content-['*'] after:ml-0.5 after:text-red-400 block text-sm font-medium">
                Username
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-sm pl-2 h-8 mt-2 dark:bg-slate-800 border border-stone-500"
                type="text"
                placeholder="your username"
                required
              />
            </label>
            <br />
            <label className="mt-2 block w-full">
              <span className="after:content-['*'] after:ml-0.5 after:text-red-400 block text-sm font-medium">
                Email
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm pl-2 h-8 mt-2 dark:bg-slate-800 border border-stone-500"
                type="text"
                placeholder="you@example.com"
                required
              />
            </label>
            <br />
            <label className="mt-2 block w-full">
              <span className="after:content-['*'] after:ml-0.5 after:text-red-400 block text-sm font-medium">
                Phone
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-sm pl-2 h-8 mt-2 dark:bg-slate-800 border border-stone-500"
                type="tel"
                placeholder="+91XXXXXXXXXX"
                minLength={10}
                maxLength={13}
                required
              />
            </label>
            <br />
            <button
              disabled={isLoading}
              onClick={handleFormSave}
              className="border h-9 rounded-sm mt-14 hover:border-green-500 w-full shadow-md hover:text-green-500 hover:shadow-green-500"
            >
              Save
            </button>
            <br />
            <button
              className="border h-9 rounded-sm mt-4 hover:text-red-500 hover:border-red-500 w-full shadow-md hover:shadow-red-500"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default UserList;
