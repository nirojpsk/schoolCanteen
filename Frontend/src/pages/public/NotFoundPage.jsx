import { Link } from "react-router-dom";
import SectionTitle from "../../components/common/SectionTitle";

export default function NotFoundPage() {
  return (
    <section className="page-section pt-12">
      <div className="content-shell">
        <div className="glass-panel rounded-[36px] p-8 text-center md:p-12">
          <SectionTitle
            badge="404"
            title="This page could not be found"
            subtitle="The route may have changed, or the page may not exist anymore."
            center
          />

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="primary-button">
              Go to homepage
            </Link>
            <Link to="/menu" className="secondary-button">
              Browse menu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
