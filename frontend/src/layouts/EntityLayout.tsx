import { Link, NavLink, useNavigate } from 'react-router-dom';
import useToken from '../hooks/useToken';
import { useEffect } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser';
import { toast } from 'react-hot-toast';

const EntityLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const { token, deleteToken } = useToken();
  const {  error } = useCurrentUser(token);

  useEffect(() => {
    if (!token) {
      navigate('/sign-in');
    }
    if (error?.response.status === 403) {
      toast.error("Your login session has expired. Please sign in again.")
      deleteToken();
      navigate('/sign-in');
    }
  }, [token, navigate, error, deleteToken]);

  return (
    <div className="bg-[#F8F8F8] h-screen w-screen flex justify-center items-center relative">
      <Link to="/" className="absolute top-2 right-4 font-inter text-primary underline">
        Skip for now {'>>'}
      </Link>
      <div className="w-[613px] bg-white shadow-md shadow-slate-300 rounded-lg">
        <div className="mx-11">
          <div className="mt-4 flex justify-center gap-10 font-inter font-medium text-[#637381]">
            <NavLink
              className={({ isActive }) =>
                (isActive ? 'text-primary before:opacity-100 ' : 'before:opacity-0 ') +
                'relative py-4 cursor-pointer before:absolute before:-bottom-[2px] before:z-10 before:w-full before:h-[2px] before:bg-primary hover:text-primary hover:before:opacity-100 transition-all duration-150'
              }
              to="/create-entity"
            >
              Create a Legal Entity
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                (isActive ? 'text-primary before:opacity-100 ' : 'before:opacity-0 ') +
                'relative py-4 cursor-pointer before:absolute before:-bottom-[2px] before:z-10 before:w-full before:h-[2px] before:bg-primary hover:text-primary hover:before:opacity-100 transition-all duration-150'
              }
              to="/join-entity"
            >
              Join a Legal Entity
            </NavLink>
          </div>
          <div className="line opacity-90"></div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default EntityLayout;
