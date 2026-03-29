import { GridPostList, Loader } from "@/components/shared";
import { Input } from "@/components/ui";
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queries";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetPosts();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch);

  useEffect(() => {
    if (inView && !searchValue && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, searchValue, hasNextPage]);

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults && 
    posts.pages.every((item) => item.documents.length === 0);

  return (
    <div className="explore-container bg-green-50 p-6 rounded-lg shadow-md">
      <div className="explore-inner_container mb-4">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Search Posts</h2>
        <div className="flex items-center gap-2 px-4 w-full rounded-lg bg-green-200">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="w-full py-2 px-3 rounded-md bg-white"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center w-full max-w-5xl mt-16 mb-7">
        <h3 className="text-xl font-semibold text-green-800">Popular Today</h3>

        <div className="flex items-center gap-3 bg-green-300 rounded-xl px-4 py-2 cursor-pointer">
          <p className="text-green-700">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-green-600 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts.pages.map((page, index) => (
            <GridPostList key={`page-${index}`} posts={page.documents} />
          ))
        )}
      </div>

      {isFetchingNextPage && (
        <div className="flex-center w-full mt-10">
          <Loader />
        </div>
      )}

      <div ref={ref} />
    </div>
  );
};

export default Explore;
