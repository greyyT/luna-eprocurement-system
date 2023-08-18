import { Link } from 'react-router-dom';

import MagnifyingGlass from '@/assets/icons/magnifying.svg';
import Product1 from '@/assets/images/product-1.png';

interface SearchBoxProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  searchResult: any;
  api: string;
  placeholder: string;
  name: string;
  code: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ search, setSearch, searchResult, api, placeholder, name, code }) => {
  return (
    <div className="relative">
      <input
        type="text"
        className="outline-none h-full w-[385px] rounded-lg border border-solid border-gray-300 px-12 font-inter leading-6 placeholder:text-[#637381] placeholder:opacity-50"
        placeholder={placeholder}
        value={search}
        onChange={(ev) => setSearch(ev.target.value)}
      />
      <img src={MagnifyingGlass} alt="" className="absolute top-1/2 -translate-y-1/2 left-6" />
      {searchResult && searchResult?.length !== 0 && (
        <div className="absolute top-full left-0 w-full bg-white rounded-lg border border-solid border-gray-300 mt-2 z-30">
          <div className="flex flex-col gap-2 p-4">
            <p className="font-inter font-semibold text-lg text-black">Search results</p>
            <div className="flex flex-col gap-2">
              {searchResult?.map((result: any) => {
                return (
                  <Link
                    key={result?.code}
                    to={`/${api}/${result?.[code]}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <img src={Product1} alt="" className="w-[40px]" />
                    <div className="flex flex-col gap-1">
                      <p className="font-inter font-semibold text-lg text-black">{result?.[name]}</p>
                      <p className="font-inter font-medium text-[#637381]">{result?.[code]}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {searchResult?.length === 0 && (
        <div className="absolute top-full left-0 w-full bg-white rounded-lg border border-solid border-gray-300 mt-2 z-30">
          <div className="flex flex-col gap-2 p-4">
            <p className="font-inter font-semibold text-lg text-black">Search results</p>
            <div className="flex flex-col gap-2">
              <p className="font-inter font-medium text-center text-lg text-black">No results found</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
