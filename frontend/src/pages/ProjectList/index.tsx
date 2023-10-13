import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import axiosInstance, { handleError } from '@/api/axios';
import { useModal } from '@/hooks/useModal';
import useProjectList from '@/hooks/useProjectList';
import useMountTransition from '@/hooks/useMountTransition';
import AddProjectModal from '@/components/modals/AddProjectModal';
import SearchBox from '@/components/ui/SearchBox';
import ConfirmationModal from '@/components/modals/ConfirmationModal';

import PlusIcon from '@/assets/icons/plus-white.svg';
import TrashActive from '@/assets/icons/trash-active.svg';
import TrashInactive from '@/assets/icons/trash-inactive.svg';
import EditIcon from '@/assets/icons/edit.svg';
import { AxiosError } from 'axios';
import { usePurchaseRequisition } from '@/hooks/usePurchaseRequisition';
import Pagination from '@/components/ui/Pagination';

const ProjectList = () => {
  useEffect(() => {
    document.title = 'Project List';
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const currentPage = params.get('page') || 1;

  const { data: projectList, isLoading: projectListLoading, mutate } = useProjectList(currentPage);

  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any>();

  // Handle search projects
  useEffect(() => {
    if (search.length !== 0) {
      const onSearchProjects = async () => {
        try {
          const response = await axiosInstance.get(`/api/project?search=${search}&page=1&size=2`);
          setSearchResult(response?.data.data);
        } catch (error) {
          toast.error('Failed to search projects');
        }
      };
      onSearchProjects();
    } else {
      setSearchResult(null);
    }
  }, [search]);

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
  const [projectId, setProjectId] = useState<string>('');
  const confirmationTransition = useMountTransition(isConfirmationOpen, 200);
  const fetchPurchaseRequisition = usePurchaseRequisition((state) => state.fetchData);

  // Handle delete project
  const onDeleteProject = async () => {
    if (loading) return;

    setLoading(true);
    const toastLoading = toast.loading('Deleting project...');
    try {
      await axiosInstance.delete(`/api/project/${projectId}`);
      await mutate();
      toast.success('Project deleted successfully');
      setIsConfirmationOpen(false);
      toast.dismiss(toastLoading);
      await fetchPurchaseRequisition();
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Failed to delete project');
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
          {projectListLoading ? (
            <div className="flex gap-5 animate-pulse">
              <div className="w-[385px] rounded-lg bg-slate-200 h-11"></div>
              <div className="h-11 w-11 bg-slate-200 rounded-[4px]"></div>
            </div>
          ) : (
            <div className="flex gap-5">
              <SearchBox
                search={search}
                setSearch={setSearch}
                searchResult={searchResult}
                api={'project'}
                placeholder={'Search by project name, label or code'}
                name="name"
                code="code"
                link={false}
                onClick={(result: any) => {
                  setVariant('edit');
                  setData(result);
                  onOpen();
                  setSearch('');
                }}
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
          )}
        </div>
        <div className="mt-5 flex flex-col bg-white rounded-[10px] border border-solid border-gray-300 px-9">
          <div className="grid projects-list-columns w-full">
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Project name</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Project label</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">Project code</h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">
              Remaining amount
            </h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center">
              Purchase Count
            </h3>
            <h3 className="font-inter text-black font-semibold leading-6 py-[18px] flex items-center justify-center">
              Action
            </h3>
          </div>
          <div className="line"></div>
          {projectListLoading ? (
            [...Array(3)].map((_, idx: number) => (
              <div className="contents" key={idx}>
                <div className="grid projects-list-columns w-full">
                  <div className="flex items-center my-[46px]">
                    <div className="h-7 w-44 bg-slate-200 rounded-md"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-6 w-20 rounded-md bg-slate-200"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-6 w-20 rounded-md bg-slate-200"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-6 w-36 rounded-md bg-slate-200"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-6 w-28 rounded-md bg-slate-200"></div>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-8 w-8 rounded-md bg-slate-200"></div>
                    <div className="h-8 w-8 rounded-md bg-slate-200"></div>
                  </div>
                </div>
                {idx !== 2 && <div className="line"></div>}
              </div>
            ))
          ) : projectList?.totalElements !== 0 ? (
            projectList?.data?.map((project, idx: number) => {
              return (
                <div className="contents" key={idx}>
                  <div className="grid projects-list-columns w-full">
                    <div className="flex items-center py-[46px] relative">
                      <p className="font-semibold text-lg font-inter text-black pr-5">{project?.name}</p>
                      {project?.isDefault && (
                        <p
                          className="
                            absolute 
                            bottom-4 
                            py-1 
                            px-[14px] 
                            text-sm 
                            leading-[22px] 
                            font-medium 
                            text-primary 
                            font-inter 
                            rounded-[30px] 
                            bg-primary 
                            bg-opacity-10"
                        >
                          Default Project
                        </p>
                      )}
                    </div>
                    <p className="flex items-center font-inter font-semibold text-lg leading-6 text-black">
                      {project?.label}
                    </p>
                    <p className="flex items-center font-inter font-semibold text-lg leading-6 text-black">
                      {project?.code}
                    </p>
                    <p className="flex items-center font-inter font-semibold text-lg leading-6 text-black">
                      {(Number(project?.purchaseAllowance) - Number(project?.currentPurchase)).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="flex items-center font-inter font-semibold text-lg leading-6 text-black">
                      {project?.purchaseCount}
                    </p>
                    <div className="flex items-center justify-center">
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
                          setProjectId(project?.id);
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
        {!projectListLoading && projectList?.totalElements !== 0 && (
          <div className="mt-14 flex items-center justify-center">
            <Pagination totalPages={projectList?.totalPages} />
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectList;
