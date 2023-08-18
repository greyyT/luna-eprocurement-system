import ActionButton from '@/components/ui/ActionButton';
import { ROLE_LIST } from '@/utils/role';

const ConfigureRoles = () => {
  return (
    <div className="mt-9 rounded-xl overflow-hidden sidebar-shadow">
      <div className="grid grid-cols-3 px-11 pr-56">
        <h3 className="font-inter font-medium text-[15px] leading-[26px] text-black py-4">ROLES</h3>
        <h3 className="font-inter font-medium text-[15px] leading-[26px] text-black py-4 flex justify-center">
          PERMISSION
        </h3>
        <h3 className="font-inter font-medium text-[15px] leading-[26px] text-black py-4 flex justify-center">
          ACTION
        </h3>
      </div>
      <div className="line"></div>
      <div className="grid grid-cols-3 px-11 bg-white pr-56">
        {ROLE_LIST.map((role: any, idx: number) => (
          <div key={idx} className="contents">
            <div className="flex items-center text-mainText text-sm font-inter h-20">{role}</div>
            <div className="flex gap-5 justify-center items-center text-white text-sm font-inter font-medium">
              <div className="bg-red text-white px-3 py-1 rounded-[30px] cursor-pointer">Reject</div>
              <div className="bg-green text-white px-3 py-[6px] rounded-[30px] cursor-pointer">Approve</div>
            </div>
            <div className="flex items-center justify-center gap-5">
              <ActionButton type="edit" onClick={() => {}} />
            </div>
          </div>
        ))}
      </div>
      <div className="pt-5 bg-white" />
    </div>
  );
};

export default ConfigureRoles;
