import { useEffect, useState } from 'react';

import { DepartmentProps, Member, TeamProps } from '@/utils/interface';
import { useModal } from '@/hooks/useModal';
import { ROLE_LIST } from '@/utils/role';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-hot-toast';

import UserPortrait from '@/assets/images/user-portrait.png';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useCurrentEntity } from '@/hooks/useCurrentEntity';
import EditUserSelectBox from '@/pages/Settings/UserList/components/EditUserSelectBox';
import { AxiosError } from 'axios';
import axiosInstance, { handleError } from '@/api/axios';

interface EditUserModalProps {
  isOpen: boolean;
  hasTransitionedIn: boolean;
  onClose: () => void;
  mutate: any;
}

interface RoleProps {
  id: number;
  name: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, hasTransitionedIn, mutate }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: currentUser } = useCurrentUser();
  const { data: entityInfo } = useCurrentEntity();

  const member: Member = useModal((state) => state.data);
  const setClosable = useModal((state) => state.setClosable);

  const [department, setDepartment] = useState<DepartmentProps | null | undefined>(null);
  const [team, setTeam] = useState<TeamProps | null | undefined>(null);
  const [role, setRole] = useState<RoleProps | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [teamOptions, setTeamOptions] = useState<TeamProps[] | null>(department?.teams || null);

  useEffect(() => {
    if (isOpen) {
      const userDepartment = entityInfo?.departments?.find(
        (department) => department.departmentCode === member?.departmentCode,
      );
      setDepartment(userDepartment);

      setTeamOptions(userDepartment?.teams || null);

      const userTeam = userDepartment?.teams?.find((team) => team.teamCode === member?.teamCode);
      setTeam(userTeam);

      const userRole = ROLE_LIST.find((role) => role.name === member?.role);
      setRole(userRole);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member, isOpen]);

  // Reset all states when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setDepartment(null);
        setTeam(null);
        setTeamOptions(null);
        setRole(null);
      }, 200);
    }
  }, [isOpen]);

  const onSubmit = async () => {
    if (loading) return;

    setLoading(true);
    const toastLoading = toast.loading('Updating user...');

    let change: boolean = false;

    try {
      if (department?.departmentCode && member?.departmentCode !== department?.departmentCode) {
        await axiosInstance.post('/api/department/set-department', {
          departmentId: department?.id,
          userId: member?.id,
        });
        change = true;
      }
      if (team?.teamCode && member?.teamCode !== team?.teamCode) {
        await axiosInstance.post('/api/team/set-team', {
          teamId: team?.id,
          userId: member?.id,
        });
        change = true;
      }
      if (role?.name && member?.role !== role?.name) {
        await axiosInstance.post('/api/account/set-role', {
          role: role?.name,
          userId: member?.id,
        });
        change = true;
      }

      if (!change) {
        toast('Nothing was changed!', {
          icon: '🔔',
        });
        return;
      }

      await mutate();
      toast.success('User updated successfully');
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = handleError(error);
        toast.error(response);
      } else {
        toast.error('Something went wrong');
      }
      if (change) mutate();
    } finally {
      toast.dismiss(toastLoading);
      setLoading(false);
    }
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
          <EditUserSelectBox
            alt="-- Choose Department --"
            selected={department}
            setSelected={(value: DepartmentProps) => {
              setDepartment(value);
              setTeamOptions(value?.teams || null);
              setTeam(null);
            }}
            options={entityInfo?.departments || []}
            isLoading={loading}
            name="departmentName"
            placeholder="No department available"
          />
          <EditUserSelectBox
            alt="-- Choose Team --"
            selected={team}
            setSelected={setTeam}
            options={teamOptions}
            isLoading={loading}
            name="teamName"
            placeholder="No team available"
          />
          {currentUser?.id !== member?.id && (
            <EditUserSelectBox
              alt="-- Choose Role --"
              selected={role}
              setSelected={setRole}
              options={ROLE_LIST}
              isLoading={loading}
              name="name"
              placeholder="No role available"
            />
          )}
        </div>
        <div className="flex mt-6 gap-6">
          <button
            className={`
              flex-1 
              py-3 
              border 
              border-solid 
              border-gray-250 
              rounded-lg 
              text-black 
              font-inter 
              leading-6 
              font-medium 
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !loading && onClose()}
          >
            Close
          </button>
          <button
            className={`
              flex-1 
              py-3 
              font-inter 
              leading-6 
              font-medium 
              bg-primary 
              text-white 
              rounded-lg 
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
