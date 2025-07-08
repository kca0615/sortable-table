import { useState } from "react";
import { FaBars } from "react-icons/fa";

const navElements = [
  {
    label: "Engineering",
    relativePath: "#",
  },
  {
    label: "Product",
    relativePath: "#",
  },
  {
    label: "Design",
    relativePath: "#",
  },
];

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={"bg-background border-border "}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center">
          <span
            className={`
              self-center text-2xl font-semibold whitespace-nowrap
              text-primary
            `}
          >
            Company
          </span>
        </a>

        <button
          type="button"
          className={`
            inline-flex items-center p-2 ml-3 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200
            text-sm text-text-primary
          `}
          aria-controls="navbar-default"
          aria-expanded={isDropdownOpen}
          onClick={toggleDropdown}
        >
          <span className="sr-only">Open main menu</span>
          <FaBars />
        </button>
        <div
          className={`${
            isDropdownOpen ? "" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul
            className={`
              font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 
              bg-gray-50 md:bg-white
              border md:border-0 border-border
            `}
          >
            {navElements.map((navElement) => (
              <li key={navElement.label}>
                <a
                  href={navElement.relativePath}
                  className={`
                    block py-2 pl-3 pr-4 rounded md:border-0 md:p-0
                    text-link hover:text-link-hover
                 `}
                >
                  {navElement.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
