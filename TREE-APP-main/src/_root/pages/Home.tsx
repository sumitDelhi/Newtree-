import { Loader, PostCard, UserCard } from "@/components/shared";
import ObjectiveCard from '@/components/shared/ObjectiveCard';
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import { Models } from "appwrite";

const Home = () => {
  const { data: posts, isLoading: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();
  const { data: creators, isLoading: isUserLoading, isError: isErrorCreators } = useGetUsers(); // Remove limit parameter

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-col p-4">
        <div className="bg-red-100 p-6 rounded-lg mb-4">
          <p className="body-medium text-red-600">Something went wrong while fetching posts.</p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg">
          <p className="body-medium text-red-600">Something went wrong while fetching creators.</p>
        </div>
      </div>
    );
  }

  // Ensure proper typing for creators
  const sortedCreators = (creators?.documents ?? [])
    .map((creator) => {
      const c = creator as Models.Document & { posts?: any[] };
      return {
        ...c,
        postCount: c.posts?.length || 0,
      };
    })
    .sort((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0)); // Remove slicing

  return (
    <div className="flex flex-col md:flex-row p-4 bg-teal-100">
      <div className="flex-1 mb-4 md:mb-0 md:mr-4 bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-primary">🌳 HOME 🌱</h2>
          <img
            src="/assets/images/image.png" // Path to your image
            alt="Description of the photo"
            className="mx-auto mt-4 max-w-full h-auto rounded-lg shadow-xl"
          />
        </div>
        <ObjectiveCard dailyObjective={3258} monthlyObjective={1000000} yearlyObjective={15100000} />
        <div className="relative mb-8 mt-6 md:mb-12 text-center">
          <div className="flex items-center justify-between">
            <hr className="flex-1 border-t-2 border-primary" />
            <h2 className="mx-4 text-3xl font-bold text-primary">🌳 TRENDING 🌱</h2>
            <hr className="flex-1 border-t-2 border-primary" />
          </div>
        </div>
        {isPostLoading && !posts ? (
          <Loader />
        ) : (
          <ul className="flex flex-col gap-8 md:gap-10">
            {posts?.documents.length === 0 ? (
              <li className="text-center text-xl font-semibold text-gray-700">
                You Have No Posts
              </li>
            ) : (
              posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center">
                  <PostCard post={post} />
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-primary mb-4 text-center">LEADERBOARD</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid grid-cols-1 gap-4 justify-items-center">
            {sortedCreators.map((creator: Models.Document & { postCount?: number }, index: number) => (
              <li key={creator.$id} className="w-full max-w-[300px]">
                <UserCard
                  user={creator}
                  isFirst={index === 0}
                  isSecond={index === 1}
                  isThird={index === 2}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
