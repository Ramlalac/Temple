import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

function HeroSection() {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const { t } = useLanguage();

  const toggleSound = () => {
    const video = videoRef.current;

    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    video.volume = nextMuted ? 0 : 1;
    setIsMuted(nextMuted);
    video.play();
  };

  const openFullscreenVideo = async () => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = false;
    video.volume = 1;
    setIsMuted(false);
    await video.play();

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-hero-glow text-ink">
      {/* Main Section Background */}
      <img
        src="https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=1800&q=80"
        alt="Temple"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.12]"
      />
      
      {/* Global Gradients */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/96 via-amber-50/90 to-white/78" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,190,64,0.22),transparent_18%),radial-gradient(circle_at_80%_10%,rgba(30,122,88,0.12),transparent_24%)]" />

      <div className="section-shell grid gap-12 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-32">
        {/* Left Content */}
        <div className="animate-fadeUp">
          <p className="text-sm uppercase tracking-[0.4em] text-gold">
            Devotion, seva, and community
          </p>
          <h1 className="mt-6 max-w-3xl font-heading text-5xl leading-tight sm:text-6xl">
            A living Krishna temple for darshan, satsang, annadan, and spiritual learning.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            Join daily worship, festival celebrations, prasadam seva, and community programs rooted in Krishna bhakti.
          </p>  
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/activities"
              className="rounded-full bg-gradient-to-r from-saffron to-gold px-6 py-3 text-sm font-semibold text-white transition hover:shadow-glow"
            >
              Explore Activities
            </Link>
            <Link
              to="/donations"
              className="glass-pill px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold"
            >
              Support the Temple
            </Link>
          </div>
        </div>

        {/* Right Content - FULL VIDEO CARD */}
        <div className="card-surface animate-float relative h-[28rem] overflow-hidden rounded-[2.5rem] p-2">
          {/* The Full Background Video */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              src="/assets/temple.mp4"
              aria-label="Temple darshan video"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              autoPlay
              muted
              loop
              playsInline
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#050c18] via-[#050c18]/40 to-transparent"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#050c18]/20 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Card Content Overlay */}
          <div className="relative z-10 flex h-full flex-col justify-between rounded-[2.2rem] border border-white/10 p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-gold/90 font-medium">
                  Temple Darshan
                </p>
                <h3 className="mt-4 font-heading text-4xl text-white drop-shadow-lg">
                  Hare Krishna 
                </h3>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={toggleSound}
                  className="rounded-full border border-white/20 bg-black/30 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:border-gold hover:bg-black/45"
                  aria-label={isMuted ? "Turn video sound on" : "Turn video sound off"}
                >
                  {isMuted ? "Sound On" : "Mute"}
                </button>
                <button
                  type="button"
                  onClick={openFullscreenVideo}
                  className="rounded-full border border-white/20 bg-black/30 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:border-gold hover:bg-black/45"
                  aria-label="Watch video in full screen"
                >
                  Full Screen
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="h-[1px] flex-1 bg-white/20" />
               <p className="text-[10px] uppercase tracking-widest text-white/40">Divine Presence</p>
               <div className="h-[1px] flex-1 bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
