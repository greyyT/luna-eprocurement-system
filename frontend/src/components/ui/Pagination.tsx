import React from 'react';
import { useSearchParams } from 'react-router-dom';

import ArrowIcon from '@/assets/icons/arrow.svg';

interface PaginationProps {
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = React.memo(({ totalPages }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pages: number[] = [];

  const currentPage = searchParams.get('page') || 1;

  const handlePreviousPage = () => {
    if (Number(currentPage) !== 1) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', (Number(currentPage) - 1).toString());
      setSearchParams(newSearchParams);
    }
  };

  const handleNextPage = () => {
    if (Number(currentPage) !== totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', (Number(currentPage) + 1).toString());
      setSearchParams(newSearchParams);
    }
  };

  const setCurrentPage = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  };

  if (totalPages <= 1 || Number(currentPage) > totalPages) {
    return null;
  }

  for (let i = 1; i <= totalPages; ++i) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="flex p-4 gap-3 border border-solid border-gray-50 rounded-md">
        <button
          className={
            'flex items-center justify-center w-[35px] h-[35px] border border-solid border-gray-50 rounded-md ' +
            (Number(currentPage) === 1 && 'opacity-50 cursor-default')
          }
          onClick={handlePreviousPage}
        >
          <img src={ArrowIcon} alt="" className="w-[7px] rotate-180" />
        </button>
        {pages.map((page, idx) => {
          return (
            <button
              key={idx}
              className={
                'flex items-center justify-center w-[35px] h-[35px] border border-solid rounded-md ' +
                (Number(currentPage) === page ? 'text-white bg-primary border-primary' : 'border-gray-50 text-mainText')
              }
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          );
        })}
        <button
          className={
            'flex items-center justify-center w-[35px] h-[35px] border border-solid border-gray-50 rounded-md ' +
            (Number(currentPage) === totalPages && 'opacity-50 cursor-default')
          }
          onClick={handleNextPage}
        >
          <img src={ArrowIcon} alt="" className="w-[7px]" />
        </button>
      </div>
    </div>
  );
});

export default Pagination;
