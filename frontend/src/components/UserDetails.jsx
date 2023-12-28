import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToastStore } from '../store/toastStore';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const UserDetails = () => {
  const [user, setUser] = useState({ username: '', email: '', phone: '' });
  const [show, hide] = useToastStore((state) => [state.show, state.hide]);
  const token = useAuthStore((state) => state.token);
  const { id } = useParams();

  async function fetchUser() {
    try {
      const res = await axios.get(
        `/api/userlist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data.user);
    } catch (error) {
      console.error(error);
      show('Something went wrong');
      setTimeout(() => {
        hide();
      }, 3000);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="w-96 box-border h-80 px-4 mx-auto">
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <p>{user.phone}</p>
    </div>
  );
};

export default UserDetails;
