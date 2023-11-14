import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import useMemberList from '@/hooks/useMemberList';
import Pagination from '@/components/ui/Pagination';
import ActionButton from '@/components/ui/ActionButton';
import EditUserModal from '@/components/modals/EditUserModal';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import axiosInstance, { handleError } from '@/api/axios';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import useCurrentUser from '@/hooks/useCurrentUser';

import UserPortrait from '@/assets/images/user-portrait.png';
import { AxiosError } from 'axios';
import { useLocation } from 'react-router-dom';

const UserList = () => {
  useEffect(() => {
    document.title = 'User List';
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const currentPage = params.get('page') || 1;

  // Modal props
  const isOpen = useModal((state) => state.isOpen);
  const onClose = useModal((state) => state.onClose);
  const onOpen = useModal((state) => state.onOpen);
  const setData = useModal((state) => state.setData);
  const hasTransitionedIn = useMountTransition(isOpen, 200);

  // Confirmation modal props for deleting user
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [memberId, setMemberId] = useState<string>('');
  const confirmationModalTransition = useMountTransition(isConfirmationOpen, 200);

  const { data: user } = useCurrentUser();
  const { data: memberList, isLoading: memberListLoading, mutate } = useMemberList(currentPage);

  const [loading, setLoading] = useState<boolean>(false);

  const usersPerPage = 6;

  // Handle deleting user
  const onDeleteUser = async (id: string): Promise<void> => {
    if (loading) return;

    setLoading(true);
    const toastLoading = toast.loading('Deleting user...');

    try {
      await axiosInstance.delete(`/api/entity/account/${id}`);
      await mutate();
      toast.success('User deleted successfully');
      setIsConfirmationOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('An error occurred');
      }
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={() => onDeleteUser(memberId)}
        hasTransitionedIn={confirmationModalTransition}
        isLoading={loading}
        header="Are you sure?"
        description="This will permanently delete the user from the entity."
      />
      <EditUserModal isOpen={isOpen} onClose={onClose} hasTransitionedIn={hasTransitionedIn} mutate={mutate} />
      <div className="mt-9 rounded-xl overflow-hidden sidebar-shadow">
        <div className="grid user-list-columns px-11">
          <h3 className="font-inter text-black font-medium text-[15px] leading-[26px] h-15 flex items-center">NAME</h3>
          <h3 className="font-inter text-black font-medium text-[15px] leading-[26px] h-15 flex items-center">
            DEPARTMENT/TEAMS
          </h3>
          <h3 className="font-inter text-black font-medium text-[15px] leading-[26px] h-15 flex items-center">ROLE</h3>
          <h3 className="font-inter text-black font-medium text-[15px] leading-[26px] h-15 flex justify-center items-center">
            ACTION
          </h3>
        </div>
        <div className="line"></div>
        <div className="grid user-list-columns px-11 bg-white">
          {memberListLoading &&
            [...Array(6)].map((_, index) => (
              <div key={index} className="contents">
                <div className="flex gap-[18px] h-20 items-center animate-pulse max-w-full">
                  <div className="w-[46px] h-[46px] bg-slate-200 rounded-full"></div>
                  <div>
                    <h3 className="bg-slate-200 h-4 w-28 max-w-full rounded-md"></h3>
                    <p className="bg-slate-200 h-4 w-52 max-w-full rounded-md mt-2"></p>
                  </div>
                </div>
                <div className="flex flex-col justify-center animate-pulse">
                  <h3 className="bg-slate-200 h-4 w-44 max-w-full rounded-md"></h3>
                  <p className="bg-slate-200 h-4 w-16 max-w-full rounded-md mt-2"></p>
                </div>
                <div className="flex items-center animate-pulse">
                  <p className="bg-slate-200 h-5 w-28 max-w-full rounded-md"></p>
                </div>
                <div className="flex items-center justify-center gap-5 animate-pulse">
                  <div className="h-9 w-20 bg-slate-200 rounded-[32px]"></div>
                  <div className="h-9 w-20 bg-slate-200 rounded-[32px]"></div>
                </div>
              </div>
            ))}
          {!memberListLoading &&
            memberList?.data?.map((member) => {
              return (
                <div key={member.email} className="contents">
                  <div className="flex gap-[18px] h-20 items-center">
                    <img src={UserPortrait} alt="" className="w-[46px]" />
                    <div className="text-sm leading-5 font-inter">
                      <h3 className="text-black font-medium">{member.username}</h3>
                      <p className="text-mainText">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center text-mainText text-sm leading-5 font-inter">
                    <h3 className="font-semibold">{member.departmentName || ''}</h3>
                    <p className="mt-1">{member.teamName || ''}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="font-inter text-mainText text-sm leading-5">{member.role}</p>
                  </div>
                  <div className="flex items-center justify-center gap-5">
                    <ActionButton
                      type="edit"
                      isLoading={loading}
                      onClick={() => {
                        onOpen();
                        setData(member);
                      }}
                    />
                    {member.email !== user?.email && (
                      <ActionButton
                        isLoading={loading}
                        type="delete"
                        onClick={() => {
                          setMemberId(member.id);
                          setIsConfirmationOpen(true);
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
        {!memberListLoading && memberList?.totalElements === 0 && (
          <h1 className="font-inter font-medium text-center py-4 bg-white">
            This entity currently has no member available
          </h1>
        )}
        {!memberListLoading && memberList?.data?.length && usersPerPage < memberList.data.length && (
          <div className="pt-5 bg-white"></div>
        )}
      </div>
      {!memberListLoading && (
        <div className="flex mt-6 justify-center">
          <Pagination totalPages={memberList?.totalPages} />
        </div>
      )}
    </>
  );
};

export default UserList;
