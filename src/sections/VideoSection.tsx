export function VideoSection() {
  return (
    <section className="py-20 bg-black/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="youtube-square border-4 border-psy-neonPurple/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(154,2,208,0.2)]">
          <iframe
            src="https://www.youtube.com/embed/MLDChN3C1bI?autoplay=1&mute=1&loop=1&playlist=MLDChN3C1bI,0b-w8j6lIKQ,MOBdkkeXLto&controls=1&rel=0&modestbranding=1"
            title="microDOS(2) Experience Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}
