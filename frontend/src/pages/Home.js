import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <div className="text-center">
          <h1 className="fw-bold">Welcome to Prephire</h1>
          <p className="text-muted mt-3">
            Upload your resume, get it reviewed by admins, and receive feedback
            to improve your profile.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
