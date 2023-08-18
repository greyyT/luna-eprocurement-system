import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import useToken from '@/hooks/useToken';

import HomeIcon from '@/assets/icons/home.svg';
import DashboardIcon from '@/assets/icons/dashboard.svg';
import BoxIcon from '@/assets/icons/box.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import LogoutIcon from '@/assets/icons/logout.svg';
import LunarIcon from '@/assets/icons/lunar-client.svg';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { deleteToken } = useToken();
  const entityCode = params.get('entityCode');

  const logout = () => {
    deleteToken();
    navigate('/sign-in');
  };

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-70 bg-white sidebar-shadow z-10">
      <div className="flex items-center gap-3 mt-10 mx-6">
        <img src={LunarIcon} className="w-10" alt="" />
        <p className="font-inter text-black font-semibold">Lunar e-Procurement</p>
      </div>
      <div className="mt-11 flex flex-col">
        <NavLink
          to={`/?entityCode=${entityCode}`}
          className={({ isActive }) =>
            (isActive
              ? 'bg-[#F4F7FF] before:absolute before:w-[3px] before:h-full before:right-0 before:bg-primary '
              : 'hover:bg-[#F4F7FF] hover:before:absolute hover:before:w-[3px] hover:before:h-full hover:before:right-0 hover:before:bg-primary ') +
            'relative flex h-[42px] gap-[10px] px-10 items-center'
          }
        >
          <img src={HomeIcon} alt="" className="w-[18px]" />
          <p className="font-inter leading-6 text-mainText">Home</p>
        </NavLink>
        <NavLink
          to={`/projects?entityCode=${entityCode}`}
          className={({ isActive }) =>
            (isActive
              ? 'bg-[#F4F7FF] before:absolute before:w-[3px] before:h-full before:right-0 before:bg-primary '
              : 'hover:bg-[#F4F7FF] hover:before:absolute hover:before:w-[3px] hover:before:h-full hover:before:right-0 hover:before:bg-primary ') +
            'relative flex h-[42px] gap-[10px] px-10 items-center'
          }
        >
          <img src={DashboardIcon} alt="" className="w-[18px]" />
          <p className="font-inter leading-6 text-mainText">Projects List</p>
        </NavLink>
        <NavLink
          to={`/products?entityCode=${entityCode}`}
          className={({ isActive }) =>
            (isActive
              ? 'bg-[#F4F7FF] before:absolute before:w-[3px] before:h-full before:right-0 before:bg-primary '
              : 'hover:bg-[#F4F7FF] hover:before:absolute hover:before:w-[3px] hover:before:h-full hover:before:right-0 hover:before:bg-primary ') +
            'relative flex h-[42px] gap-[10px] px-10 items-center'
          }
        >
          <img src={BoxIcon} alt="" className="w-[18px]" />
          <p className="font-inter leading-6 text-mainText">Products List</p>
        </NavLink>
        <NavLink
          to={`/vendors?entityCode=${entityCode}`}
          className={({ isActive }) =>
            (isActive
              ? 'bg-[#F4F7FF] before:absolute before:w-[3px] before:h-full before:right-0 before:bg-primary '
              : 'hover:bg-[#F4F7FF] hover:before:absolute hover:before:w-[3px] hover:before:h-full hover:before:right-0 hover:before:bg-primary ') +
            'relative flex h-[42px] gap-[10px] px-10 items-center'
          }
        >
          <img src={DashboardIcon} alt="" className="w-[18px]" />
          <p className="font-inter leading-6 text-mainText">Vendor List</p>
        </NavLink>
        <div className="line mx-10 mt-2"></div>
        <Link
          to={'/settings'}
          className={
            (window.location.pathname.includes('/settings')
              ? 'bg-[#F4F7FF] before:absolute before:w-[3px] before:h-full before:right-0 before:bg-primary '
              : 'hover:bg-[#F4F7FF] hover:before:absolute hover:before:w-[3px] hover:before:h-full hover:before:right-0 hover:before:bg-primary ') +
            'relative flex h-[42px] gap-[10px] px-10 mt-4 items-center'
          }
        >
          <img src={SettingsIcon} alt="" className="w-[18px]" />
          <p className="font-inter leading-6 text-mainText">Settings</p>
        </Link>
        <button
          className="relative flex h-[42px] gap-[10px] px-10 items-center hover:bg-[#F4F7FF] hover:before:absolute hover:before:w-[3px] hover:before:h-full hover:before:right-0 hover:before:bg-primary"
          onClick={logout}
        >
          <img src={LogoutIcon} alt="" className="w-[18px]" />
          <p className="font-inter leading-6 text-mainText">Log out</p>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
