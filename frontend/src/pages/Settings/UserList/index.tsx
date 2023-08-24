import { useCallback, useEffect, useState } from 'react';

import useToken from '@/hooks/useToken';
import useMemberList from '@/hooks/useMemberList';
import Pagination from '@/components/ui/Pagination';
import ActionButton from '@/components/ui/ActionButton';
import { useCurrentEntity } from '@/hooks/useCurrentEntity';
import EditUserModal from '@/components/modals/EditUserModal';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import UserPortrait from '@/assets/images/user-portrait.png';
import axiosInstance from '@/api/axios';
import ConfirmationModal from '@/components/modals/ConfirmationModal';

const UserList = () => {
  useEffect(() => {
    document.title = 'User List';
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const isOpen = useModal((state) => state.isOpen);
  const onClose = useModal((state) => state.onClose);
  const onOpen = useModal((state) => state.onOpen);
  const setData = useModal((state) => state.setData);
  const hasTransitionedIn = useMountTransition(isOpen, 200);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const confirmationModalTransition = useMountTransition(isConfirmationOpen, 200);

  const { token } = useToken();
  const legalEntityCode = params.get('entityCode');
  const { data: memberList = [], mutate } = useMemberList(legalEntityCode || '', token);

  const { data: entityInfo } = useCurrentEntity(legalEntityCode || '', token);

  const [loading, setLoading] = useState<boolean>(false);

  const currentPage = Number(params.get('page')) || 1;

  const usersPerPage = 5;
  const lastUserIdx = currentPage * usersPerPage;
  const firstUserIdx = lastUserIdx - usersPerPage;
  const currentMemberList = memberList?.slice(firstUserIdx, lastUserIdx);
  const totalPages = Math.ceil(memberList?.length / usersPerPage);

  const onDelete = useCallback(
    async (email: string) => {
      if (loading) return;

      setLoading(true);
      const toastLoading = toast.loading('Deleting user...');
      try {
        await axiosInstance.delete(`/api/${legalEntityCode}/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('User deleted successfully');
        mutate();
      } catch (error) {
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
        toast.dismiss(toastLoading);
        setIsConfirmationOpen(false);
      }
    },
    [legalEntityCode, mutate, token, loading],
  );

  return (
    <>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={() => onDelete(email)}
        hasTransitionedIn={confirmationModalTransition}
        isLoading={loading}
        header="Are you sure?"
        description="This will permanently delete the user from the entity."
      />
      <EditUserModal
        entityInfo={entityInfo}
        isOpen={isOpen}
        onClose={onClose}
        hasTransitionedIn={hasTransitionedIn}
        mutate={mutate}
      />
      <div className="mt-9 rounded-xl overflow-hidden sidebar-shadow">
        <div className="grid user-list-columns px-11">
          <h3 className="font-inter text-black font-medium text-[15px] leading-[26px] h-15 flex items-center">NAME</h3>
          <h3 className="font-inter text-black font-medium text-[15px] leading-[26px] h-15 flex items-center">
            DEPARTMENT/TEAMS
          </h3>
          <h3 className="font-inter text-black font-medium text-[15px] leading-[26px] h-15 flex items-center">ROLE</h3>
          <h3 className="font-inter text-black font-medium text-[15px] leading-[26px] h-15 flex items-center ml-15">
            ACTION
          </h3>
        </div>
        <div className="line"></div>
        <div className="grid user-list-columns px-11 bg-white">
          {currentMemberList?.map((member: any) => {
            return (
              <div key={member?.email} className="contents">
                <div className="flex gap-[18px] h-20 items-center">
                  <img src={UserPortrait} alt="" className="w-[46px]" />
                  <div className="text-sm leading-5 font-inter">
                    <h3 className="text-black font-medium">{member?.username}</h3>
                    <p className="text-mainText">{member?.email}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center text-mainText text-sm leading-5 font-inter">
                  <h3 className="font-semibold">{member?.departmentName ? member?.departmentName : ''}</h3>
                  <p className="mt-1">{member?.teamName ? member?.teamName : ''}</p>
                </div>
                <div className="flex items-center">
                  <p className="font-inter text-mainText text-sm leading-5">{member?.role}</p>
                </div>
                <div className="flex items-center gap-5">
                  <ActionButton
                    type="edit"
                    isLoading={loading}
                    onClick={() => {
                      onOpen();
                      setData(member);
                    }}
                  />
                  <ActionButton
                    isLoading={loading}
                    type="delete"
                    onClick={() => {
                      setEmail(member?.email);
                      setIsConfirmationOpen(true);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {currentMemberList?.length === 0 && (
          <h1 className="font-inter font-medium text-center py-4 bg-white">
            This entity currently has no member available
          </h1>
        )}
        {usersPerPage < currentMemberList?.length && <div className="pt-5 bg-white"></div>}
      </div>
      <div className="flex mt-6 justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
};

export default UserList;
