import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const dashboardLink = role === "ADMIN" ? "/admin" : "/user";

  const brandLink = token ? dashboardLink : "/home";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* BRAND */}
        <Link className="navbar-brand fw-bold" to={brandLink}>
          Prephire
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>

            {/* ✅ ALWAYS SHOW DASHBOARD WHEN LOGGED IN */}
            {token && (
              <li className="nav-item">
                <Link className="nav-link" to={dashboardLink}>
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* RIGHT SIDE */}
          {token && (
            <button className="btn btn-outline-danger btn-sm" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
