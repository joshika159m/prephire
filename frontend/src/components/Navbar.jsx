import { Link, useNavigate } from "react-router-dom";

function Navbar({ role }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand fw-bold">Prephire</span>

        <div className="d-flex gap-3">
          <Link
            className="btn btn-outline-light btn-sm"
            to={role === "ADMIN" ? "/admin" : "/user"}
          >
            Dashboard
          </Link>

          <button className="btn btn-outline-danger btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
