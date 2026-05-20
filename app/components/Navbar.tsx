import { Link, useLocation } from "react-router";

const Navbar = () => {
  const { pathname } = useLocation();
  const onUpload = pathname === "/upload";

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 pb-2">
      <nav className="navbar max-w-6xl shadow-sm border border-white/60">
        <Link to="/" className="text-2xl font-bold text-gradient tracking-tight">
          Resumind
        </Link>
        <div className="flex items-center gap-3">
          {!onUpload && (
            <Link to="/" className="secondary-link hidden sm:inline">
              Home
            </Link>
          )}
          <Link
            to="/upload"
            className={
              onUpload
                ? "btn-secondary !py-2 !px-5 pointer-events-none opacity-70"
                : "primary-button !w-auto !px-6 !py-2.5 text-sm font-semibold"
            }
          >
            {onUpload ? "New analysis" : "Analyze resume"}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
