import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import SectionTitle from "../../components/common/SectionTitle";
import { siteConfig } from "../../constants/siteConfig";

const contactCards = [
  {
    title: "Visit the canteen",
    value: siteConfig.location,
    actionLabel: "Open in Maps",
    actionHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.location)}`,
  },
  {
    title: "Call the team",
    value: siteConfig.phone,
    actionLabel: "Call now",
    actionHref: `tel:${siteConfig.phone}`,
  },
  {
    title: "Opening hours",
    value: `${siteConfig.hours.weekdays} | ${siteConfig.hours.main}`,
    actionLabel: "View lunch window",
    actionHref: "/about",
  },
];

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const mailtoLink = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      formData.subject || "Canteen enquiry"
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;

    window.location.href = mailtoLink;
    toast.success("Opening your mail app with the message details.");
  };

  return (
    <section className="page-section pt-10">
      <div className="content-shell">
        <SectionTitle
          badge="Contact"
          title="Reach the canteen team without guesswork"
          subtitle="There is no backend contact form yet, so this page is intentionally practical: direct phone, email, map, and a mail-prep form that already works."
        />

        <div className="mt-10 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[38px] bg-[linear-gradient(135deg,#0b5a42_0%,#137552_100%)] p-8 text-white shadow-[0_30px_60px_rgba(7,49,36,0.18)]">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#ffc629]">
                Direct Contact
              </p>
              <h2 className="mt-6 text-4xl font-extrabold leading-tight">
                Questions about lunch, pickup, or availability?
              </h2>
              <p className="mt-4 text-base leading-8 text-emerald-50/76">
                Contact the canteen team directly and get a faster answer than relying on a generic contact form queue.
              </p>
              <div className="mt-6 rounded-[28px] bg-white/8 p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-100/56">
                  Direct Email
                </p>
                <p className="mt-2 text-lg font-extrabold text-white">{siteConfig.email}</p>
              </div>
            </div>

            {contactCards.map((card, index) => {
              const isInternalLink = card.actionHref.startsWith("/");

              return (
                <div key={card.title} className="soft-panel p-6">
                  <p className="subtle-kicker">0{index + 1}</p>
                  <h3 className="mt-3 text-xl font-extrabold text-slate-950">{card.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{card.value}</p>
                  {isInternalLink ? (
                    <Link to={card.actionHref} className="secondary-button mt-4 text-sm">
                      {card.actionLabel}
                    </Link>
                  ) : (
                    <a
                      href={card.actionHref}
                      target={card.actionHref.startsWith("http") ? "_blank" : undefined}
                      rel={card.actionHref.startsWith("http") ? "noreferrer" : undefined}
                      className="secondary-button mt-4 text-sm"
                    >
                      {card.actionLabel}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          <div className="soft-panel p-6 md:p-8">
            <div className="max-w-2xl">
              <p className="section-badge">Prepared Email</p>
              <h3 className="mt-5 text-4xl font-extrabold text-slate-950">Send a detailed message</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The form below opens your default mail app with the message already drafted, which keeps the experience functional until a dedicated contact API is added.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="field-label">Your name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="field-input"
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="field-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Lunch question, allergy note, pickup timing..."
                  className="field-input"
                  required
                />
              </div>

              <div>
                <label className="field-label">Message</label>
                <textarea
                  name="message"
                  rows="7"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="field-input"
                  required
                />
              </div>

              <button type="submit" className="primary-button w-full">
                Open Mail App
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
