import { Link, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

import useToken from '@/hooks/useToken';
import useCurrentUser from '@/hooks/useCurrentUser';

import CopyIcon from '@/assets/icons/copy.svg';

const Settings = () => {
  const navigate = useNavigate();

  const { token } = useToken();
  const { data: user } = useCurrentUser(token);

  useEffect(() => {
    if (window.location.pathname.endsWith('settings')) {
      navigate(`/settings/user-list?entityCode=${user?.legalEntityCode}`);
    }
  }, [user, navigate]);

  const routes = [
    {
      path: 'user-list',
      content: 'User list',
    },
    {
      path: 'teams',
      content: 'Deparment/Teams',
    },
    {
      path: 'roles-config',
      content: 'Configure Roles',
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(user.legalEntityCode);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  if (user?.role !== 'MANAGER') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5.25rem)]">
        <h1>Only Manager can access this page</h1>
      </div>
    );
  }

  return (
    <div className="px-10 pt-7">
      <div className="flex justify-between">
        <div>
          <h1 className="font-inter font-semibold text-2xl leading-[30px] text-black">Settings</h1>
          <p className="mt-2 font-inter text-sm leading-5 text-mainText">
            In this page, user can manage admin list, create teams and configure roles
          </p>
        </div>
        <div className="flex items-center bg-white rounded-[10px] border border-solid border-[#e4e4e4] gap-20 px-5">
          <div className="py-3">
            <h3 className="text-black leading-5 font-inter font-medium">Legal Entity Code</h3>
            <p className="text-sm mt-1 leading-5 text-mainText">{user?.legalEntityCode}</p>
          </div>
          <button
            className="bg-primary bg-opacity-[0.08] hover:bg-opacity-25 active:bg-opacity-25 rounded-md p-2"
            onClick={handleCopy}
          >
            <img src={CopyIcon} alt="" className="w-[26px]" />
          </button>
        </div>
      </div>
      <div className="mt-4 h-15 flex gap-16">
        {routes.map((route, idx) => {
          return (
            <Link
              key={idx}
              to={`/settings/${route.path}?entityCode=${user?.legalEntityCode}`}
              className={
                (window.location.pathname.includes(route.path)
                  ? 'text-primary before:absolute before:h-[2px] before:w-full before:-bottom-[2px] before:bg-primary '
                  : 'text-mainText hover:before:absolute hover:before:h-[2px] hover:before:w-full hover:before:-bottom-[2px] hover:before:bg-primary hover:text-primary ') +
                'relative flex items-center justify-center w-37.5 max-w-full h-full leading-5 font-inter'
              }
            >
              {route.content}
            </Link>
          );
        })}
      </div>
      <div className="line"></div>
      <Outlet />
    </div>
  );
};

export default Settings;
