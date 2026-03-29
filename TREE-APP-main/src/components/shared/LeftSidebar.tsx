import { Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { INITIAL_USER, useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { INavLink } from "@/types";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();

  const { mutate: signOut } = useSignOutAccount();

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  // Reorder sidebarLinks and filter out undefined values
  const orderedSidebarLinks: INavLink[] = [
    'Home',
    'Create Post',
    'Explore',
    'People',
    'Saved'
  ].map(label => sidebarLinks.find(link => link.label === label))
   .filter((link): link is INavLink => link !== undefined);

  return (
    <nav className="flex flex-col bg-primary text-black border-r border-green-900 h-full p-4">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/LOGO2.jpg" // Path to your logo image
            alt="logo"
            className="h-10 w-10 rounded-full" // Adjust size to fit your design
          />
          <span className="text-2xl font-bold text-green-900">NewTree</span>
        </Link>

        {isLoading || !user.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full" // Ensure no unwanted styles are applied here
            />
            <div className="flex flex-col">
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-green-950">@{user.username}</p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-6">
          {orderedSidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`group rounded-md ${isActive ? "bg-secondary" : ""}`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4 text-black hover:bg-secondary rounded-full"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`w-5 h-5 ${
                      link.label === "Home" || link.label === "Create Post" || link.label === "Explore" || link.label === "People" || link.label === "Saved" ? "logo-black" : ""
                    } group-hover:invert ${isActive ? "invert" : ""}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="flex items-center gap-2 mt-auto text-white hover:bg-green-400"
        onClick={(e) => handleSignOut(e)}
      >
        <img src="/assets/icons/logout.svg" alt="logout" className="w-5 h-5 logo-black" />
        <p className="text-sm">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
