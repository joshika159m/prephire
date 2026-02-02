function Footer() {
  return (
    <footer className="bg-dark text-light mt-5">
      <div className="container py-3 text-center">
        <p className="mb-1 fw-bold">Prephire</p>
        <p className="mb-1 small">Resume Review Platform for Students</p>
        <p className="mb-1 small">Contact: support@prephire.com</p>
        <p className="mb-0 small">
          © {new Date().getFullYear()} Prephire. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
