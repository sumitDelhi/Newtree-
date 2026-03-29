import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { Button } from "../ui/button";

const Topbar = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar bg-primary text-black shadow-md flex items-center px-4">
      <div className="flex items-center">
        {/* Logout Button */}
        <Button
          variant="ghost"
          className="p-0 bg-transparent hover:bg-transparent" // Remove background
          onClick={() => signOut()}
        >
          <img src="/assets/icons/logout.svg" alt="logout" className= "logo-black h-6 w-6" />
        </Button>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-full">
            <img
              src="/assets/images/LOGO2.jpg"
              alt="logo"
              className="object-cover h-full w-full"
            />
          </div>
          <span className="text-xl font-bold text-green-900">NewTree</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to={`/profile/${user.id}`} className="flex items-center">
          <div className="h-8 w-8 overflow-hidden rounded-full">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className=" logo-black object-cover h-full w-full"
            />
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Topbar;
