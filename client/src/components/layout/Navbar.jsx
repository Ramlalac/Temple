import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navLinks } from "../../data/siteContent";
import { useLanguage } from "../../i18n/LanguageContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, languages, setLanguage, t } = useLanguage();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="section-shell flex items-center justify-between py-4">
        <Link to="/" className="max-w-[13rem]">
          <p className="font-heading text-xl text-ink sm:text-2xl">{t("siteName")}</p>
          <p className="text-xs uppercase tracking-[0.32em] text-gold">
            {t("siteTagline")}
          </p>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-semibold uppercase tracking-[0.2em] transition ${
                  isActive ? "text-gold" : "text-ink hover:text-gold"
                }`
              }
            >
              {t(`nav.${link.key}`, link.label)}
            </NavLink>
          ))}
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-full border border-amber-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink outline-none transition hover:border-gold"
            aria-label={t("nav.language")}
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.shortLabel}
              </option>
            ))}
          </select>
          <Link
            to="/donations"
            className="rounded-full bg-gradient-to-r from-saffron to-gold px-5 py-3 text-sm font-semibold text-white transition hover:shadow-glow"
          >
            {t("nav.donateNow")}
          </Link>
        </nav>

        <button
          type="button"
          className="glass-pill inline-flex px-4 py-2 text-sm font-semibold lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {t("nav.menu")}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-amber-100 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="section-shell flex flex-col gap-4 px-0">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold uppercase tracking-[0.18em] ${
                    isActive ? "text-gold" : "text-ink"
                  }`
                }
              >
                {t(`nav.${link.key}`, link.label)}
              </NavLink>
            ))}
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="input-surface max-w-44 py-2 text-sm font-semibold"
              aria-label={t("nav.language")}
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
