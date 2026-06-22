import { Link } from "react-router-dom";
import SectionTitle from "../components/common/SectionTitle";
import Seo from "../components/common/Seo";
import HeroSection from "../components/home/HeroSection";
import { featuredGallery, introStats, timingData, whatsappCommunity } from "../data/siteContent";
import { useLanguage } from "../i18n/LanguageContext";

function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <Seo
        title={t("home.seoTitle")}
        description={t("home.seoDescription")}
      />
      <HeroSection />

      <section className="section-shell py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="card-surface p-8 sm:p-10">
            <SectionTitle
              eyebrow={t("home.overviewEyebrow")}
              title={t("home.overviewTitle")}
              description={t("home.overviewDescription")}
            />
          </div>
          <div className="grid gap-5">
            {introStats.map((stat) => (
              <div key={stat.label} className="card-surface p-6 text-center">
                <p className="font-heading text-4xl text-gold">{stat.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-stone-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="card-surface p-8 sm:p-10">
            <SectionTitle
              eyebrow={t("home.timingsEyebrow")}
              title={t("home.timingsTitle")}
              description={t("home.timingsDescription")}
            />
            <div className="mt-8 space-y-4">
              {timingData.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-5 py-4"
                >
                  <span className="font-medium text-stone-700">{item.label}</span>
                  <span className="font-semibold text-saffron">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {featuredGallery.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-[1.8rem] shadow-aura">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-72 w-full object-cover transition duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pb-20">
        <div className="grid gap-8 rounded-lg border border-amber-100 bg-white p-6 shadow-aura sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold">
              {t("home.communityEyebrow")}
            </p>
            <h2 className="mt-4 font-heading text-4xl text-ink">{t("home.communityTitle")}</h2>
            <p className="soft-copy mt-4 max-w-2xl text-lg leading-8">{t("home.communityDescription")}</p>
            <a
              href={whatsappCommunity.inviteLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-saffron to-gold px-6 py-3 text-sm font-semibold text-white transition hover:shadow-glow"
            >
              {t("home.communityButton")}
            </a>
            <p className="mt-4 text-xs text-stone-500">{t("home.communityNote")}</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-white p-4 shadow-aura">
            <img
              src={whatsappCommunity.qrImage}
              alt={whatsappCommunity.groupName}
              className="h-64 w-64"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="section-shell">
          <div className="rounded-lg border border-amber-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,244,220,0.82),rgba(248,212,107,0.18))] px-8 py-12 text-center text-ink shadow-aura sm:px-12">
            <p className="text-sm uppercase tracking-[0.32em] text-gold">
              {t("home.offerEyebrow")}
            </p>
            <h2 className="mt-4 font-heading text-3xl sm:text-4xl">
              {t("home.offerTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-stone-700">
              {t("home.offerDescription")}
            </p>
            <Link
              to="/donations"
              className="glass-pill mt-8 inline-flex px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold"
            >
              {t("home.makeDonation")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
