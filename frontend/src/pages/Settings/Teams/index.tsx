import { createDepartment, createTeam, deleteDepartment } from '@/api/entity';
import AddTeamModal from '@/components/modals/AddTeamModal';
import ActionButton from '@/components/ui/ActionButton';
import { useCurrentEntity } from '@/hooks/useCurrentEntity';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import useToken from '@/hooks/useToken';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import PlusCircle from '@/assets/icons/plus-circle.svg';

const Teams = () => {
  useEffect(() => {
    document.title = 'Departments/Teams';
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { token } = useToken();
  const legalEntityCode = params.get('entityCode');
  const { data: entityInfo = [], mutate } = useCurrentEntity(legalEntityCode || '', token);

  const [loading, setLoading] = useState<boolean>(false);

  const [variant, setVariant] = useState<'Department' | 'Team'>('Department');
  const [departmentCode, setDepartmentCode] = useState<string>('');
  const isOpen = useModal((state) => state.isOpen);
  const onClose = useModal((state) => state.onClose);
  const onOpen = useModal((state) => state.onOpen);
  const hasTransitionedIn = useMountTransition(isOpen, 200);

  const onDelete = async (code: string) => {
    setLoading(true);
    const toastLoading = toast.loading('Deleting department...');

    const response = await deleteDepartment(token, code);

    toast.dismiss(toastLoading);
    setLoading(false);

    if (!response) {
      toast.error('Something went wrong');
      return;
    }

    toast.success('Department deleted successfully');
  };

  return (
    <>
      <AddTeamModal
        isOpen={isOpen}
        onClose={onClose}
        hasTransitionedIn={hasTransitionedIn}
        variant={variant}
        handleCreate={variant === 'Department' ? createDepartment : createTeam}
        departmentCode={departmentCode}
        mutate={mutate}
      />
      <div className="mt-9 rounded-xl overflow-hidden sidebar-shadow">
        <div className="grid grid-cols-3 px-11 pr-56">
          <div className="flex gap-4">
            <h3 className="font-inter font-medium text-[15px] leading-[26px] text-black py-4">DEPARTMENT</h3>
            <img
              src={PlusCircle}
              alt=""
              className="cursor-pointer"
              onClick={() => {
                setVariant('Department');
                onOpen();
              }}
            />
          </div>
          <h3 className="font-inter font-medium text-[15px] leading-[26px] text-black py-4 flex justify-center">
            TEAMS
          </h3>
          <h3 className="font-inter font-medium text-[15px] leading-[26px] text-black py-4 flex justify-center">
            ACTION
          </h3>
        </div>
        <div className="line"></div>
        {entityInfo?.departments?.length === 0 ? (
          <p className="py-4 bg-white text-center font-semibold font-inter">No departments added</p>
        ) : (
          entityInfo?.departments?.map((department: any, idx: number) => (
            <div key={idx} className="grid grid-cols-3 px-11 bg-white pr-56">
              <div className="contents">
                <div className="flex items-center text-mainText text-sm font-inter h-20">
                  {department?.departmentName}
                </div>
                <div className="flex flex-col gap-3 py-3 justify-center items-center text-mainText text-sm font-inter">
                  {department?.teams?.map((team: any, idx: number) => (
                    <p key={idx}>{team?.teamName}</p>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-5">
                  <ActionButton
                    type="add team"
                    isLoading={loading}
                    onClick={() => {
                      setVariant('Team');
                      setDepartmentCode(department?.departmentCode);
                      onOpen();
                    }}
                  />
                  <ActionButton
                    type="delete"
                    isLoading={loading}
                    onClick={() => onDelete(department?.departmentCode)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Teams;
