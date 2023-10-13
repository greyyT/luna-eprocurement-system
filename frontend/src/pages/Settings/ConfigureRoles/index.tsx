import axiosInstance, { handleError } from '@/api/axios';
import ActionButton from '@/components/ui/ActionButton';
import { useRole } from '@/hooks/useRole';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface IRole {
  id: string;
  role: string;
  reject: boolean;
  approve: boolean;
}

const ConfigureRoles = () => {
  useEffect(() => {
    document.title = 'Configure Roles';
  }, []);

  const { data: roles, isLoading: rolesLoading, mutate } = useRole();

  const [editRole, setEditRole] = useState<IRole | null>(null);
  const [editState, setEditState] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onEditRole = async (): Promise<void> => {
    if (isLoading) return;

    const role = roles?.find((role) => role.id === editRole?.id);

    if (editRole?.reject === role?.reject && editRole?.approve === role?.approve) {
      toast('Nothing was changed!', {
        icon: '🔔',
      });
      return;
    }

    setIsLoading(true);
    const toastLoading = toast.loading('Updating role...');

    try {
      await axiosInstance.patch('/api/role', {
        id: editRole?.id,
        reject: editRole?.reject,
        approve: editRole?.approve,
      });
      await mutate();
      toast.success('Role updated successfully');
      setEditState(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('An error occurred');
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  return (
    <div className="mt-9 rounded-xl overflow-hidden sidebar-shadow">
      <div className="grid grid-cols-3 px-11">
        <h3 className="font-inter font-medium text-[15px] leading-[26px] text-black py-4">ROLES</h3>
        <h3 className="font-inter font-medium text-[15px] leading-[26px] text-black py-4 flex justify-center">
          PERMISSION
        </h3>
        <h3 className="font-inter font-medium text-[15px] leading-[26px] text-black py-4 flex justify-center">
          ACTION
        </h3>
      </div>
      <div className="line"></div>
      <div className="grid grid-cols-3 px-11 bg-white">
        {rolesLoading &&
          [...Array(5)].map((_, idx) => (
            <div key={idx} className="contents">
              <div className="flex items-center h-20 animate-pulse">
                <div className="h-4 w-28 bg-slate-200 rounded-lg"></div>
              </div>
              <div className="flex gap-5 justify-center items-center text-white text-sm font-inter font-medium">
                <div className="bg-slate-200 h-7 w-24 max-w-full rounded-[32px]"></div>
                <div className="bg-slate-200 h-7 w-24 max-w-full rounded-[32px]"></div>
              </div>
              <div className="flex items-center justify-center gap-5 animate-pulse">
                <div className="bg-slate-200 h-9 w-24 max-w-full rounded-[32px]"></div>
                <div className="bg-slate-200 h-9 w-24 max-w-full rounded-[32px]"></div>
              </div>
            </div>
          ))}
        {!rolesLoading &&
          roles?.map((role, idx: number) => (
            <div key={idx} className="contents">
              <p className="flex items-center text-mainText text-sm font-inter h-20">{role.role}</p>
              <div className="flex gap-5 justify-center items-center text-white text-sm font-inter font-medium">
                <div className="relative">
                  {editState && editRole?.id === role.id && (
                    <span
                      onClick={() => {
                        if (isLoading) return;
                        setEditRole({
                          ...editRole,
                          reject: !editRole?.reject,
                        });
                      }}
                      className={`
                      absolute 
                      -top-2 
                      -left-2 
                      leading-4
                      px-2 
                      border 
                      border-solid 
                      border-white 
                      rounded-full 
                      cursor-pointer 
                      z-10
                      ${editRole?.reject ? 'bg-red' : 'bg-green'}
                      ${isLoading ? 'cursor-not-allowed' : ''}
                    `}
                    >
                      {editRole?.reject ? '-' : '+'}
                    </span>
                  )}
                  <p
                    className={`px-3 py-1 bg-mainText text-whiet rounded-[30px] font-inter ${
                      editState && editRole?.id === role.id
                        ? editRole?.reject
                          ? ''
                          : 'opacity-30'
                        : !role.reject
                        ? 'opacity-30'
                        : ''
                    }
                ${isLoading ? 'cursor-not-allowed' : ''}`}
                  >
                    Reject
                  </p>
                </div>
                <div className="relative">
                  {editState && editRole?.id === role.id && (
                    <span
                      onClick={() => {
                        if (isLoading) return;
                        setEditRole({
                          ...editRole,
                          approve: !editRole?.approve,
                        });
                      }}
                      className={`
                      absolute 
                      -top-2 
                      -left-2 
                      leading-4
                      px-2 
                      border 
                      border-solid 
                      border-white 
                      rounded-full 
                      cursor-pointer 
                      z-10
                      ${editRole?.approve ? 'bg-red' : 'bg-green'}
                      ${isLoading ? 'cursor-not-allowed' : ''}
                    `}
                    >
                      {editRole?.approve ? '-' : '+'}
                    </span>
                  )}
                  <p
                    className={`px-3 py-1 bg-mainText text-whiet rounded-[30px] font-inter ${
                      editState && editRole?.id === role.id
                        ? editRole?.approve
                          ? ''
                          : 'opacity-30'
                        : !role.approve
                        ? 'opacity-30'
                        : ''
                    }
                ${isLoading ? 'cursor-not-allowed' : ''}`}
                  >
                    Approve
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-5">
                {editState && editRole?.id === role.id ? (
                  <>
                    <ActionButton type="done" onClick={onEditRole} isLoading={isLoading} />
                    <ActionButton
                      type="cancel"
                      onClick={() => !isLoading && setEditState(false)}
                      isLoading={isLoading}
                    />
                  </>
                ) : (
                  <ActionButton
                    type="edit"
                    onClick={() => {
                      if (isLoading) return;
                      if (editState) {
                        toast.error('Please save your changes first');
                        return;
                      }
                      setEditRole(role);
                      setEditState(true);
                    }}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>
          ))}
      </div>
      <div className="pt-5 bg-white" />
    </div>
  );
};

export default ConfigureRoles;
