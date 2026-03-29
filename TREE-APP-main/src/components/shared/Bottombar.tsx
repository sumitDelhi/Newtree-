import { bottombarLinks } from "@/constants";
import { Link, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();

  return (
    <section className="fixed bottom-0 left-0 right-0 bg-primary text-black flex items-center justify-around py-2 border-t border-secondary">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            key={`bottombar-${link.label}`}
            to={link.route}
            className={`flex flex-col items-center gap-1 p-2 transition-transform transform ${
              isActive ? "bg-secondary rounded-md scale-110" : ""
            }`}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              width={20}
              height={20}
              className={`logo-black transition-transform ${
                isActive ? "invert" : ""
              }`}
            />
            <p className={`text-xs ${isActive ? "text-black" : "text-black"}`}>
              {link.label}
            </p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
