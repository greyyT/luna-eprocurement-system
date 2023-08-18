import { useEffect, useState } from 'react';

import useToken from '@/hooks/useToken';
import { Member } from '@/utils/interface';
import { useModal } from '@/hooks/useModal';
import { ROLE_LIST } from '@/utils/role';
import Modal from '@/components/ui/Modal';
import SelectBox from '@/components/modals/SelectBox';
import { toast } from 'react-hot-toast';
import { setUserDepartment, setUserRole, setUserTeam } from '@/api/entity';

import UserPortrait from '@/assets/images/user-portrait.png';

interface EditUserModalProps {
  isOpen: boolean;
  hasTransitionedIn: boolean;
  onClose: () => void;
  entityInfo: any;
  mutate: any;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ entityInfo, isOpen, onClose, hasTransitionedIn, mutate }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { token } = useToken();

  const member: Member = useModal((state) => state.data);
  const setClosable = useModal((state) => state.setClosable);

  const [department, setDepartment] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [role, setRole] = useState<null | string>(member?.role);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setDepartment({
      departmentCode: member?.departmentCode,
      departmentName: member?.departmentName,
    });
    setTeam({
      teamCode: member?.teamCode,
      teamName: member?.teamName,
    });
    setRole(member?.role);
  }, [member]);

  const selectBoxes = [
    {
      selected: department,
      setSelected: setDepartment,
      options: entityInfo?.departments || [],
      code: 'departmentCode',
      name: 'departmentName',
      alt: 'Choose Department',
    },
    {
      selected: !department?.departmentCode ? false : team,
      setSelected: setTeam,
      options:
        entityInfo?.departments &&
        entityInfo?.departments.find((depart: any) => depart.departmentCode === department?.departmentCode)?.teams,
      code: 'teamCode',
      name: 'teamName',
      alt: 'Choose Team',
    },
    {
      selected: role,
      setSelected: setRole,
      options: ROLE_LIST.filter((item) => item !== role),
      code: '',
      alt: 'Choose Role',
    },
  ];

  const onSubmit = async () => {
    if (loading) return;

    let change: boolean = false;
    setLoading(true);
    const toastLoading = toast.loading('Updating user...');

    if (department?.departmentCode && member.departmentCode !== department?.departmentCode) {
      change = true;
      const res = await setUserDepartment(token, department.departmentCode, member.email);

      if (!res) {
        toast.error('Something went wrong');
        return undefined;
      }
    }

    if (team?.teamCode && member.teamCode !== team?.teamCode) {
      change = true;
      const res = await setUserTeam(token, team.teamCode, member.email);

      if (!res) {
        toast.error('Something went wrong');
        return undefined;
      }
    }

    if (role && member.role !== role) {
      change = true;
      const res = await setUserRole(token, role, member.email);

      if (!res) {
        toast.error('Something went wrong');
        return undefined;
      }
    }

    toast.dismiss(toastLoading);
    setLoading(false);

    if (!change) {
      toast('Nothing was changed!', {
        icon: '🔔',
      });
      return undefined;
    }

    mutate();
    toast.success('User updated successfully');
    onClose();
  };

  if (!isMounted) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} isLoading={loading}>
      <div
        className="p-9 bg-white rounded-[20px]"
        onClick={(ev) => {
          ev.stopPropagation();
          setClosable(true);
        }}
      >
        <h3 className="font-bold font-inter text-2xl leading-[30px] text-black">Edit information</h3>
        <div className="h-[3px] w-[500px] mt-3 bg-primary"></div>
        <div className="flex mt-4 gap-4">
          <img src={UserPortrait} alt="" className="w-[45px]" />
          <div className="flex flex-col justify-center font-inter">
            <p className="text-black text-sm leading-5 font-medium">{member?.username}</p>
            <p className="text-mainText text-sm leading-5">{member?.email}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-4">
          {selectBoxes.map((selectBox, idx) => (
            <div key={idx}>
              <SelectBox
                code={selectBox.code}
                name={selectBox.name}
                options={selectBox.options}
                selected={selectBox.selected}
                setSelected={selectBox.setSelected}
                alt={selectBox.alt}
                isLoading={loading}
              />
            </div>
          ))}
        </div>
        <div className="flex mt-6 gap-6">
          <button
            className={`flex-1 py-3 border border-solid border-gray-250 rounded-lg text-black font-inter leading-6 font-medium ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => {
              if (!loading) onClose();
            }}
          >
            Close
          </button>
          <button
            className={`flex-1 py-3 font-inter leading-6 font-medium bg-primary text-white rounded-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={onSubmit}
          >
            Accept
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditUserModal;
