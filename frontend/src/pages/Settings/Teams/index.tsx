import AddTeamModal from '@/components/modals/AddTeamModal';
import ActionButton from '@/components/ui/ActionButton';
import { useCurrentEntity } from '@/hooks/useCurrentEntity';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import PlusCircle from '@/assets/icons/plus-circle.svg';
import axiosInstance from '@/api/axios';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import useMemberList from '@/hooks/useMemberList';

const Teams = () => {
  useEffect(() => {
    document.title = 'Departments/Teams';
  }, []);

  const { data: entityInfo, isLoading: entityInfoLoading, mutate } = useCurrentEntity();
  const { mutate: mutateMemberList } = useMemberList(1);

  const [loading, setLoading] = useState<boolean>(false);

  const [variant, setVariant] = useState<'Department' | 'Team'>('Department');
  const [departmentId, setDepartmentId] = useState<string>('');
  const isOpen = useModal((state) => state.isOpen);
  const onClose = useModal((state) => state.onClose);
  const onOpen = useModal((state) => state.onOpen);
  const hasTransitionedIn = useMountTransition(isOpen, 200);

  const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
  const confirmationModalTransition = useMountTransition(confirmationModalOpen, 200);

  // Handle deleting department
  const onDeleteDepartment = async () => {
    if (loading) return;

    setLoading(true);
    const toastLoading = toast.loading('Deleting department...');
    try {
      await axiosInstance.delete(`/api/department/delete/${departmentId}`);
      await mutateMemberList();
      await mutate();
      toast.success('Department deleted successfully');
      setConfirmationModalOpen(false);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  };
  return (
    <>
      <ConfirmationModal
        header="Are you sure?"
        description="This action cannot be undone."
        isOpen={confirmationModalOpen}
        hasTransitionedIn={confirmationModalTransition}
        onClose={() => setConfirmationModalOpen(false)}
        isLoading={loading}
        onConfirm={onDeleteDepartment}
      />
      <AddTeamModal
        isOpen={isOpen}
        onClose={onClose}
        hasTransitionedIn={hasTransitionedIn}
        variant={variant}
        departmentId={departmentId}
        mutate={mutate}
      />
      <div className="mt-9 rounded-xl overflow-hidden sidebar-shadow">
        <div className="grid grid-cols-3 px-11 pr-56">
          <div className="flex gap-4">
            <h3 className="font-inter font-medium text-[15px] leading-[26px] text-black py-4">DEPARTMENT</h3>
            {!entityInfoLoading && (
              <img
                src={PlusCircle}
                alt=""
                className="cursor-pointer"
                onClick={() => {
                  setVariant('Department');
                  onOpen();
                }}
              />
            )}
          </div>
          <h3 className="font-inter font-medium text-[15px] leading-[26px] text-black py-4 flex justify-center">
            TEAMS
          </h3>
          <h3 className="font-inter font-medium text-[15px] leading-[26px] text-black py-4 flex justify-center">
            ACTION
          </h3>
        </div>
        <div className="line"></div>
        {entityInfoLoading &&
          [...Array(6)].map((_, idx: number) => (
            <div key={idx} className="grid grid-cols-3 px-11 bg-white pr-56 animate-pulse">
              <div className="flex items-center h-20">
                <div className="h-4 w-52 rounded-lg bg-slate-200"></div>
              </div>
              <div className="flex flex-col gap-3 py-3 justify-center items-center">
                <div className="h-[14px] w-24 rounded-lg bg-slate-200"></div>
                <div className="h-[14px] w-24 rounded-lg bg-slate-200"></div>
              </div>
              <div className="flex items-center justify-center gap-5">
                <div className="h-8 w-18 rounded-[32px] bg-slate-200"></div>
                <div className="h-8 w-18 rounded-[32px] bg-slate-200"></div>
              </div>
            </div>
          ))}
        {!entityInfoLoading && entityInfo?.departments?.length === 0 && (
          <p className="py-4 bg-white text-center font-semibold font-inter">No departments added</p>
        )}
        {!entityInfoLoading &&
          entityInfo?.departments?.length !== 0 &&
          entityInfo?.departments?.map((department, idx: number) => (
            <div key={idx} className="grid grid-cols-3 px-11 bg-white pr-56">
              <div className="flex items-center text-mainText text-sm font-inter h-20">
                {department?.departmentName}
              </div>
              <div className="flex flex-col gap-3 py-3 justify-center items-center text-mainText text-sm font-inter">
                {department?.teams?.map((team, idx: number) => (
                  <p key={idx}>{team?.teamName}</p>
                ))}
              </div>
              <div className="flex items-center justify-center gap-5">
                <ActionButton
                  type="add team"
                  isLoading={loading}
                  onClick={() => {
                    setVariant('Team');
                    setDepartmentId(department?.id);
                    onOpen();
                  }}
                />
                <ActionButton
                  type="delete"
                  isLoading={loading}
                  onClick={() => {
                    setDepartmentId(department?.id);
                    setConfirmationModalOpen(true);
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Teams;
