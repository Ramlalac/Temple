function PageHero({ title, description, image }) {
  return (
    <section className="relative isolate overflow-hidden bg-hero-glow py-24 text-ink">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-10"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/95 via-amber-50/90 to-white/86" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(248,212,107,0.2),transparent_16%),radial-gradient(circle_at_82%_18%,rgba(31,122,88,0.12),transparent_18%)]" />
      <div className="section-shell">
        <div className="max-w-3xl animate-fadeUp">
          <p className="text-sm uppercase tracking-[0.32em] text-gold">
            Shree Krishna Devasthana
          </p>
          <h1 className="mt-5 font-heading text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-6 text-lg leading-8 text-stone-700">{description}</p>
        </div>
      </div>
    </section>
  );
}

export default PageHero;
