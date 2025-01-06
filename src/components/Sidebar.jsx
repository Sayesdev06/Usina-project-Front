import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
// Icons
import {
  RiLogoutCircleRLine,
  RiArrowRightSLine,
  RiMenu3Line,
  RiCloseLine,
} from "react-icons/ri";

// navigation
import Navigation from "./Navigation";
import UserIcon from "./UserIcon";
import Cookies from "js-cookie";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [keySubmenu, setKeySubmenu] = useState(null);
  let activeStyle = {
    color: "#BDEB00",
  };

  const toggleNav = (key) => {
    if (keySubmenu === null || key == keySubmenu) {
      setShowSubmenu(!showSubmenu);
    } else {
      setShowSubmenu(true);
    }

    setKeySubmenu(key);
  };

  const navigationItem = Navigation();
  const removeToken = () => {
    Cookies.remove("token");
  };

  const role = Cookies.get("role");


  const sidebarItems = [
    { name: "Accueil", allowedRoles: ["ADMIN"] },
    { name: "Configuration", allowedRoles: ["ADMIN"] },
    {
      name: "Gestion compte tiers",
      allowedRoles: ["ADMIN","COMMERCIALE"],
    },
    { name: "Stock", allowedRoles: ["ADMIN", "MAGASINIER","COMMERCIALE"] },
    { name: "Activités", allowedRoles: ["ADMIN"] },
    {
      name: "Achat",
      allowedRoles: [
        "ADMIN","COMMERCIALE","MAGASINIER"
       ],
    },
    {
      name: "Vente",
      allowedRoles: [
        "ADMIN","RESPONSABLE DE PRODUCTION","COMMERCIALE"
      ],
    },
    {
      name: "Factures",
      allowedRoles: [
        "ADMIN","COMPTABLE"],
    },
    {
      name: "Paiements",
      allowedRoles: [
        "ADMIN","COMPTABLE"],
    },
  ];

  return (
    <>
      <div
        className={`xl:h-[100vh] overflow-y-scroll fixed xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-secondary-100 p-4 flex flex-col justify-between z-50 ${
          showMenu ? "left-0" : "-left-full"
        } transition-all`}
      >
        <div className="scaledContainer">
          <h1 className="text-center text-2xl font-bold text-white mb-10">
            USINA<span className="text-primary text-4xl">.</span>
          </h1>

          <ul>
            {navigationItem &&
              navigationItem.map((navItem, key) => {
                const element = sidebarItems.find(
                  (item) => item.name === navItem.title
                );
                const hasAccess = element.allowedRoles.includes(role)


                if (hasAccess) {
                  return navItem.items ? (
                    //navItem.title === "Configuration" && (role === "ADMIN" || role === "GESTION DES COMPTES TIERS" )?
                    <li className="mb-2 li-nav-sidebar" key={key}>
                      <button
                        onClick={() => toggleNav(key)}
                        className="w-full flex items-center justify-between py-2 hover:text-white   rounded-lg hover:bg-secondary-200 transition-colors"
                      >
                        <span
                          className="flex items-center gap-4"
                          style={{ textAlign: "initial" }}
                        >
                          <UserIcon icon={navItem.icon} />
                          {navItem.title}
                        </span>
                        <RiArrowRightSLine
                          className={`mt-1 ${
                            showSubmenu && key == keySubmenu && "rotate-90"
                          } transition-all`}
                        />
                      </button>
                      <ul
                        className={` ${
                          showSubmenu && key == keySubmenu ? "" : "h-0"
                        } overflow-y-hidden transition-all`}
                      >
                        {navItem.items.map((item, keyItem) => 
                        {const checkRole =item.allowedRols&&item.allowedRols.includes(role)
                          if(checkRole){
                            return(
                              <li key={keyItem}>
                                <NavLink
                                  to={item.path}
                                  className="py-2 px-4 border-l border-gray-500 ml-6 block relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary-100 hover:text-white transition-colors"
                                  style={({ isActive }) =>
                                    isActive ? activeStyle : undefined
                                  }
                                >
                                  {item.title}
                                </NavLink>
                              </li>
                            )
                          }
                          else return null}
                        )}
                      </ul>
                    </li>
                  ) : (
                    <li
                      className="mb-2 li-nav-sidebar hover:bg-secondary-200 rounded-lg  py-2"
                      key={key}
                    >
                      <NavLink
                        to={navItem.path}
                        className="py-2 hover:text-white rounded-lg hover:bg-secondary-900 transition-colors"
                        style={({ isActive }) =>
                          isActive ? activeStyle : undefined
                        }
                      >
                        <span
                          className="flex items-center gap-4"
                          style={{ textAlign: "initial" }}
                        >
                          <UserIcon icon={navItem.icon} />
                          {navItem.title}
                        </span>
                      </NavLink>
                    </li>
                  );
                }

                return null; // Hide the section if the user doesn't have access
                //:null
              })}
          </ul>

          {/* ************************** */}
        </div>
        <nav>
          <Link
            to="/login"
            onClick={() => removeToken()}
            className="flex items-center gap-4 py-2   rounded-lg hover:bg-secondary-200 transition-colors"
          >
            <RiLogoutCircleRLine className="text-primary" /> Déconnexion
          </Link>
        </nav>
      </div>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="xl:hidden fixed bottom-4 right-4 bg-primary text-black p-3 rounded-full z-50"
      >
        {showMenu ? <RiCloseLine /> : <RiMenu3Line />}
      </button>
    </>
  );
};

export default Sidebar;
