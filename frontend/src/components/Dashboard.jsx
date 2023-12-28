import { Link, Outlet, useLocation } from 'react-router-dom';
import UserList from './UserList';
import { useUserListStore } from '../store/userlist';
import { useEffect } from 'react';

const Dashboard = () => {
  const [showList, setShowList] = useUserListStore((state) => [
    state.showList,
    state.setShowList,
  ]);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setShowList(true);
    }
  }, [location, setShowList]);

  return (
    <div className="w-full flex box-border">
      <aside className="border border-blue-600 dark:border-blue-600 md:w-1/5 md:h-screen md:text-center pt-2">
        <h1 className="text-xl mx-auto font-semibold">
          <span className="cursor-pointer dark:hover:text-amber-300 hover:text-blue-500">
            User Dashboard
          </span>
        </h1>
        <div className="flex justify-center items-center mt-4">
          <Link className="w-full" to={`/dashboard`}>
            <div
              onClick={() => setShowList(true)}
              className="hover:border hover:text-blue-500 border-blue-500 hover:cursor-pointer dark:hover:border-amber-300 text-md font-semibold dark:hover:text-amber-300 w-full h-8 flex items-center justify-center"
            >
              User List
            </div>
          </Link>
        </div>
      </aside>
      <main className="flex-grow h-screen border border-blue-600 px-4">
        {showList && <UserList />}
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
