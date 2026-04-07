import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { siteConfig } from "../../constants/siteConfig";

function Footer() {
  return (
    <footer className="mt-16 overflow-hidden border-t border-emerald-950/10 bg-[#063b2c] text-white">
      <div className="content-shell py-14">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[34px] border border-white/10 bg-white/6 p-6 md:p-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ffc629]">
              Fresh Campus Meals
            </p>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight text-white">
              A calmer, faster school canteen experience from menu to pickup.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-emerald-50/72">
              {siteConfig.name} brings together live menu browsing, student account access,
              and practical preorder flow so everyday lunch feels more organized
              for both students and staff.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/menu" className="secondary-button border-white/12 bg-white text-emerald-950">
                Browse Menu
              </Link>
              <Link to="/preorder" className="primary-button">
                Start Preorder
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[30px] border border-white/10 bg-white/6 p-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#ffc629]">
                Service Hours
              </p>
              <div className="mt-4 space-y-1 text-sm text-emerald-50/76">
                <p className="font-semibold text-white">{siteConfig.hours.weekdays}</p>
                <p>{siteConfig.hours.main}</p>
                <p>Lunch rush: {siteConfig.hours.lunch}</p>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/6 p-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#ffc629]">
                Quick Contact
              </p>
              <div className="mt-4 space-y-3 text-sm text-emerald-50/76">
                <p>{siteConfig.location}</p>
                <a href={`tel:${siteConfig.phone}`} className="block hover:text-white">
                  {siteConfig.phone}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="block hover:text-white">
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <h3 className="text-xl font-extrabold text-white">{siteConfig.name}</h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-emerald-50/70">
              Nourishing the school day with fresh meals, reliable operations,
              and a public site that is built for real everyday use.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#ffc629]">
              Explore
            </h3>
            <div className="mt-4 grid gap-3 text-sm text-emerald-50/72">
              <Link to="/menu" className="hover:text-white">
                Browse Menu
              </Link>
              <Link to="/specials" className="hover:text-white">
                Daily Specials
              </Link>
              <Link to="/preorder" className="hover:text-white">
                Preorder Lunch
              </Link>
              <Link to="/about" className="hover:text-white">
                About The Canteen
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#ffc629]">
              Student Access
            </h3>
            <div className="mt-4 grid gap-3 text-sm text-emerald-50/72">
              <Link to="/login" className="hover:text-white">
                Sign In
              </Link>
              <Link to="/register" className="hover:text-white">
                Create Account
              </Link>
              <Link to="/account" className="hover:text-white">
                My Account
              </Link>
              <Link to="/contact" className="font-extrabold text-white">
                Contact Team
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#ffc629]">
              Stay Connected
            </h3>
            <div className="mt-4 space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-emerald-50/80">
                Get updates on live specials, pickup flow, and service info through the school canteen team.
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white hover:-translate-y-0.5 hover:bg-white/14"
                >
                  <FaFacebookF />
                </a>
                <Link
                  to="/contact"
                  className="secondary-button border-white/12 bg-white text-emerald-950"
                >
                  Contact Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50/42">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
