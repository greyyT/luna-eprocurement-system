import useCurrentUser from '@/hooks/useCurrentUser';
import useToken from '@/hooks/useToken';

import UserPortrait from '@/assets/images/user-portrait.png';

const Topbar = () => {
  const { token } = useToken();
  const { data: user } = useCurrentUser(token);

  return (
    <>
      <div className="flex h-20 items-center justify-end pr-14 bg-white">
        <div className="flex items-center gap-4">
          <div className="flex flex-col justify-end items-end">
            <h3 className="text-black font-inter text-sm leading-5 font-medium">{user?.username}</h3>
            <p className="font-inter text-xs leading-[14px] text-mainText uppercase">{user?.role}</p>
          </div>
          <img src={UserPortrait} alt="" className="w-[46px]" />
        </div>
      </div>
      <div className="line"></div>
    </>
  );
};

export default Topbar;
