import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ role, children }) {
  return (
    <>
      <Navbar role={role} />
      <main className="container mt-4">{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
