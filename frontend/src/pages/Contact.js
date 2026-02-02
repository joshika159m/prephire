import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h3 className="fw-bold mb-3">Contact Us</h3>
        <p className="text-muted">
          Have questions or feedback? Reach out to us.
        </p>

        <ul className="list-unstyled">
          <li>Email: support@prephire.com</li>
          <li>Phone: +91 98765 43210</li>
        </ul>
      </div>

      <Footer />
    </>
  );
}

export default Contact;
