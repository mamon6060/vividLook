import logo from "../../assets/agro_logo.png";

const Header = () => {
  return (
    <header className="bg-transparent bg-opacity-70 text-white backdrop-blur-md">
      <div className="mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo} // Placeholder for your logo image
            alt="Madina Refrigeration Logo"
            className="h-10 mr-2"
          />
          <h1 className="font-bold text-lg">Madina Refrigeration</h1>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="hidden md:flex space-x-6 font-semibold text-sm">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/shop" className="hover:underline">
                Shop
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:underline">
                Blog
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
          {/* Cart and Menu Icons */}
          <div className="flex items-center space-x-4">
            {/* <div className="relative">
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                0
              </span>
            </div> */}

            {/* Mobile Menu Icon */}
            {/* <button className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button> */}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
