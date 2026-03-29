import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document & { postCount?: number };
  isFirst?: boolean;
  isSecond?: boolean;
  isThird?: boolean; // New prop to indicate the third user
};

const UserCard = ({ user, isFirst = false, isSecond = false, isThird = false }: UserCardProps) => {
  return (
    <Link
      to={`/profile/${user.$id}`}
      className="relative flex flex-col items-center p-4 bg-white rounded-lg shadow-md border-2 border-primary hover:shadow-lg transition-shadow duration-300"
    >
      {/* 🥇 Emoji at the top left for the first user */}
      {isFirst && (
        <div className="absolute top-2 left-2 text-3xl">
          🥇
        </div>
      )}

      {/* 🥈 Emoji at the top left for the second user */}
      {isSecond && (
        <div className="absolute top-2 left-2 text-3xl">
          🥈
        </div>
      )}

      {/* 🥉 Emoji at the top left for the third user */}
      {isThird && (
        <div className="absolute top-2 left-2 text-3xl">
          🥉
        </div>
      )}

      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-16 h-16 mb-3"
      />

      <div className="flex flex-col items-center">
        <p className="text-base font-medium text-gray-900 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="text-sm text-gray-600 text-center line-clamp-1">
          @{user.username}
        </p>
        {user.postCount !== undefined && (
          <p className="text-sm text-gray-500 text-center mt-1">
            Posts: {user.postCount}
          </p>
        )}
      </div>

      <Button
        type="button"
        size="sm"
        className="mt-3 shad-button_primary w-full"
      >
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;
