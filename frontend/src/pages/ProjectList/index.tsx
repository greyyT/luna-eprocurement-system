import SearchBox from '@/components/ui/SearchBox';
import { useState } from 'react';

import PlusIcon from '@/assets/icons/plus-white.svg';

const ProjectList = () => {
  const [search, setSearch] = useState<string>('');
  return (
    <>
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
            <button className="bg-primary h-11 w-11 flex items-center justify-center rounded-[4px]" onClick={() => {}}>
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
        </div>
      </div>
    </>
  );
};

export default ProjectList;
