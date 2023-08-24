import SearchBox from '@/components/ui/SearchBox';
import { useCallback, useEffect, useState } from 'react';

import PlusIcon from '@/assets/icons/plus-white.svg';
import TrashActive from '@/assets/icons/trash-active.svg';
import TrashInactive from '@/assets/icons/trash-inactive.svg';
import EditIcon from '@/assets/icons/edit.svg';
import { useModal } from '@/hooks/useModal';
import useMountTransition from '@/hooks/useMountTransition';
import AddProjectModal from '@/components/modals/AddProjectModal';
import useToken from '@/hooks/useToken';
import { useLocation } from 'react-router-dom';
import useProjectList from '@/hooks/useProjectList';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/api/axios';
import ConfirmationModal from '@/components/modals/ConfirmationModal';

const ProjectList = () => {
  useEffect(() => {
    document.title = 'Project List';
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { token } = useToken();
  const legalEntityCode = params.get('entityCode') || '';
  const currentPage = params.get('page') || 1;

  const { data: projectList, mutate } = useProjectList(token, legalEntityCode, currentPage);

  const [search, setSearch] = useState<string>('');

  // Add project modal
  const isOpen = useModal((state) => state.isOpen);
  const onOpen = useModal((state) => state.onOpen);
  const onClose = useModal((state) => state.onClose);
  const setData = useModal((state) => state.setData);
  const hasTransitionedIn = useMountTransition(isOpen, 200);
  const [variant, setVariant] = useState<string>('');

  // Confirm delete project modal
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [projectCode, setProjectCode] = useState<string>('');
  const confirmationTransition = useMountTransition(isConfirmationOpen, 200);

  const onDeleteProject = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    const toastLoading = toast.loading('Deleting project...');
    try {
      await axiosInstance.delete(`/api/project/${projectCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Project deleted successfully');
      setIsConfirmationOpen(false);
      mutate();
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  }, [loading, projectCode, token, mutate]);

  return (
    <>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        hasTransitionedIn={confirmationTransition}
        isLoading={loading}
        onConfirm={onDeleteProject}
        header="Are you sure?"
        description="This action will permanently delete the project and all of its data."
      />
      <AddProjectModal
        isOpen={isOpen}
        onClose={onClose}
        hasTransitionedIn={hasTransitionedIn}
        mutate={mutate}
        variant={variant}
      />
      <div className="pl-10 pr-18 pt-7">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-inter font-semibold text-2xl leading-[30px] text-black">Project List</h1>
            <p className="mt-2 font-inter text-sm leading-5 text-mainText">
              In this page, user can view all the projects that created in this Legal Entity
            </p>
          </div>
          <div className="flex gap-5">
            <SearchBox
              search={search}
              setSearch={setSearch}
              searchResult={null}
              api={'products-list'}
              placeholder={'Search by project name, label or code'}
              name="name"
              code="code"
            />
            <button
              className="bg-primary h-11 w-11 flex items-center justify-center rounded-[4px]"
              onClick={() => {
                setVariant('add');
                onOpen();
              }}
            >
              <img src={PlusIcon} alt="" />
            </button>
          </div>
        </div>
        <div className="mt-5 flex flex-col bg-white rounded-[10px] border border-solid border-gray-300 px-9">
          <div className="grid projects-list-columns w-full">
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Project name</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Project label</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Project code</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">
              No of Purchase
            </h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Action</h3>
          </div>
          <div className="line"></div>
          {projectList?.data.length !== 0 ? (
            projectList?.data?.map((project: any, idx: number) => {
              return (
                <div className="contents" key={idx}>
                  <div className="grid projects-list-columns w-full">
                    <div className="flex items-center py-[46px] relative">
                      <p className="font-semibold text-lg font-inter text-black pr-5">{project?.name}</p>
                      {project?.isDefault && (
                        <p className="absolute bottom-4 py-1 px-[14px] text-sm leading-[22px] font-medium text-primary font-inter rounded-[30px] bg-primary bg-opacity-10">
                          Default Project
                        </p>
                      )}
                    </div>
                    <div className="flex items-center font-inter font-semibold text-lg leading-6 text-black">
                      {project?.projectCode.label}
                    </div>
                    <div className="flex items-center font-inter font-semibold text-lg leading-6 text-black">
                      {project?.projectCode.code}
                    </div>
                    <div className="flex flex-col justify-center items-baseline gap-3"></div>
                    <div className="flex items-center">
                      <img
                        src={EditIcon}
                        alt=""
                        className="cursor-pointer"
                        onClick={() => {
                          setVariant('edit');
                          setData(project);
                          onOpen();
                        }}
                      />
                      <div
                        onClick={() => {
                          setProjectCode(project?.projectCode.code);
                          setIsConfirmationOpen(true);
                        }}
                        className="relative h-5 w-4 ml-4 trash-selector cursor-pointer"
                      >
                        <img src={TrashInactive} alt="" className="absolute trash-inactive" />
                        <img src={TrashActive} alt="" className="absolute trash-active" />
                      </div>
                    </div>
                  </div>
                  {idx !== projectList?.data.length - 1 && <div className="line"></div>}
                </div>
              );
            })
          ) : (
            <p className="text-center py-4 font-inter font-medium">No project added</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectList;
