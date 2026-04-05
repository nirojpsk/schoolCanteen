import { Link } from "react-router-dom";
import { FaFacebookF, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Mechi School Canteen
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            A modern school canteen platform for fresh meals, daily specials,
            and easy preorder service.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            Quick Links
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/specials">Specials</Link></li>
            <li><Link to="/preorder">Preorder</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            Contact
          </h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-amber-700" />
              <span>Shivasatakshi-10, Maidhar, Jhapa</span>
            </li>
            <li className="flex items-start gap-3">
              <FaPhoneAlt className="mt-1 text-amber-700" />
              <span>+977 9800000000</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            Follow Us
          </h3>
          <a
            href="https://www.facebook.com/mechischool/"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-amber-100 hover:text-amber-700"
          >
            <FaFacebookF />
          </a>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-4 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Mechi School Canteen. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
