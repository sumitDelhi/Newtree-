import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { useUserContext } from "@/context/AuthContext";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post) => (
        <li key={post.$id} className="relative">
          <Link to={`/posts/${post.$id}`} className="block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
              src={post.imageUrl}
              alt="post"
              className="w-full h-48 object-cover"
            />
          </Link>

          <div className="flex items-center justify-between p-2 bg-green-100 rounded-b-lg">
            {showUser && (
              <div className="flex items-center gap-2">
                <img
                  src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="text-green-800">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
