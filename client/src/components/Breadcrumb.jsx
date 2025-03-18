const Breadcrumb = ({ children }) => {
  return (
    <div className="">
      <div
        className="relative h-60 w-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1533460004989-cef01064af7e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between h-full text-center text-white px-28">
          <h2 className="text-[24px] font-bold text-white">All Blogs</h2>
          {/* Breadcrumbs */}
          <div className="mt-6 text-base font-semibold">
            <a href="/" className="hover:underline">
              Home
            </a>
            <span className="mx-2">›</span>
            <span>{children}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
