import { Link } from "react-router-dom";
import { contactInfo } from "../../data/siteContent";
import { useLanguage } from "../../i18n/LanguageContext";

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-10 border-t border-amber-100 bg-white text-ink">
      <div className="section-shell grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-heading text-3xl text-ink">{t("siteName")}</p>
          <p className="mt-4 max-w-xl text-stone-600">
            {t("footer.description")}
          </p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-gold">{t("footer.visit")}</p>
          <p className="mt-4 text-stone-700">{contactInfo.address}</p>
          <p className="mt-3 text-stone-700">Shriniwas Annam: {contactInfo.phone}</p>
          <p className="mt-3 text-stone-700">{contactInfo.email}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-gold">{t("footer.quickLinks")}</p>
          <div className="mt-4 flex flex-col gap-3">
            <Link to="/activities" className="text-stone-700 transition hover:text-gold">
              {t("footer.activities")}
            </Link>
            <Link to="/donations" className="text-stone-700 transition hover:text-gold">
              {t("footer.donations")}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-amber-100 py-5 text-center text-sm text-stone-500">
        © 2026 {t("siteName")}. {t("footer.rights")}
      </div>
    </footer>
  );
}

export default Footer;
