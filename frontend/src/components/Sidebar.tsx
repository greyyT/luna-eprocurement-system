import { Link, NavLink, useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

import HomeIcon from '@/assets/icons/home.svg';
import DashboardIcon from '@/assets/icons/dashboard.svg';
import BoxIcon from '@/assets/icons/box.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import LogoutIcon from '@/assets/icons/logout.svg';
import LunarIcon from '@/assets/icons/lunar-client.svg';
import CartIcon from '@/assets/icons/cart.svg';
import axiosInstance from '@/api/axios';
import { useSWRConfig } from 'swr';

const Sidebar = () => {
  const navigate = useNavigate();

  const { mutate } = useSWRConfig();

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      await mutate(() => true, undefined, { revalidate: false });
      toast.success('User logged out successfully');
      navigate('/sign-in');
    } catch (error) {
      console.log(error);
    }
  };

  const sidebarItem = [
    {
      title: 'Home',
      icon: HomeIcon,
      link: '/',
    },
    {
      title: 'Purchase Requisition',
      icon: CartIcon,
      link: '/purchase-requisition',
    },
    {
      title: 'Projects List',
      icon: DashboardIcon,
      link: '/projects',
    },
    {
      title: 'Products List',
      icon: BoxIcon,
      link: '/products',
    },
    {
      title: 'Vendor List',
      icon: DashboardIcon,
      link: '/vendors',
    },
  ];

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-70 bg-white sidebar-shadow z-10">
      <div className="flex items-center gap-3 mt-10 mx-6">
        <img src={LunarIcon} className="w-10" alt="" />
        <p className="font-inter text-black font-semibold">Lunar e-Procurement</p>
      </div>
      <div className="mt-11 flex flex-col">
        {sidebarItem.map((item, index) => (
          <NavLink
            key={index}
            to={item.link}
            className={({ isActive }) => `
            relative
            flex
            h-[42px]
            gap-[10px]
            px-10
            items-center
            ${
              isActive
                ? 'bg-[#F4F7FF] before:absolute before:w-[3px] before:h-full before:right-0 before:bg-primary'
                : 'hover:bg-[#F4F7FF] hover:before:absolute hover:before:w-[3px] hover:before:h-full hover:before:right-0 hover:before:bg-primary'
            }
          `}
          >
            <img src={item.icon} alt="" className="w-[18px]" />
            <p className="font-inter leading-6 text-mainText">{item.title}</p>
          </NavLink>
        ))}
        <div className="line mx-10 mt-2"></div>
        <Link
          to="/settings"
          className={`
            relative
            flex
            h-[42px]
            gap-[10px]
            px-10
            items-center
            mt-2
            ${
              window.location.pathname.includes('/settings')
                ? 'bg-[#F4F7FF] before:absolute before:w-[3px] before:h-full before:right-0 before:bg-primary'
                : 'hover:bg-[#F4F7FF] hover:before:absolute hover:before:w-[3px] hover:before:h-full hover:before:right-0 hover:before:bg-primary'
            }
          `}
        >
          <img src={SettingsIcon} alt="" className="w-[18px]" />
          <p className="font-inter leading-6 text-mainText">Settings</p>
        </Link>
        <button
          className="
            relative 
            flex 
            h-[42px] 
            gap-[10px] 
            px-10 
            items-center 
            hover:bg-[#F4F7FF] 
            hover:before:absolute 
            hover:before:w-[3px] 
            hover:before:h-full 
            hover:before:right-0 
            hover:before:bg-primary"
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
