import { Link } from 'react-router-dom';

import MagnifyingGlass from '@/assets/icons/magnifying.svg';

interface SearchBoxProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  searchResult: any;
  api?: string;
  placeholder: string;
  name: string;
  code: string;
  img?: string;
  link: boolean;
  onClick?: any;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  search,
  setSearch,
  searchResult,
  api,
  placeholder,
  name,
  code,
  img,
  link,
  onClick,
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        className="outline-none h-full w-[385px] rounded-lg border border-solid border-gray-300 pl-12 pr-2 font-inter leading-6 placeholder:text-[#637381] placeholder:opacity-50"
        placeholder={placeholder}
        value={search}
        onChange={(ev) => setSearch(ev.target.value)}
      />
      <img src={MagnifyingGlass} alt="" className="absolute top-1/2 -translate-y-1/2 left-6" />
      {search.length !== 0 && searchResult && searchResult?.length !== 0 && (
        <div className="absolute top-full left-0 w-full bg-white rounded-lg border border-solid border-gray-300 mt-2 z-30">
          <div className="flex flex-col gap-2 py-4">
            <p className="font-inter font-semibold text-mainText px-4">Search results</p>
            <div className="line mx-4"></div>
            <div className="flex flex-col gap-2">
              {link &&
                searchResult?.map((result: any, idx: number) => {
                  return (
                    <Link
                      key={idx}
                      to={`/${api}/${result?.[code]}`}
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition-all px-4 py-2"
                    >
                      {img && (
                        <div
                          style={{ backgroundImage: `url('${result?.[img]}')` }}
                          className="w-10 h-10 bg-cover bg-no-repeat bg-center"
                        ></div>
                      )}
                      <div className="flex flex-col">
                        <p className="font-inter font-semibold text-lg text-black">{result?.[name]}</p>
                        <p className="font-inter font-medium text-[#637381] text-sm">{result?.[code]}</p>
                      </div>
                    </Link>
                  );
                })}
              {!link &&
                searchResult?.map((result: any, idx: number) => {
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition-all px-4 py-2"
                      onClick={() => onClick(result)}
                    >
                      {img && (
                        <div
                          style={{ backgroundImage: `url('${result?.[img]}')` }}
                          className="w-10 h-10 bg-cover bg-no-repeat bg-center"
                        ></div>
                      )}
                      <div className="flex flex-col">
                        <p className="font-inter font-semibold text-lg text-black">{result?.[name]}</p>
                        <p className="font-inter font-medium text-[#637381] text-sm">{result?.[code]}</p>
                      </div>
                    </div>
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
