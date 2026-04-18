import { FlaskConical, ShieldCheck, Target } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="hero-bg pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Discover <span className="text-psy-neonGreen">micro</span>
          <span className="text-psy-neonPurple">DOS</span>
          <span className="text-psy-neonPink">(2)</span>
        </h1>
        <p className="text-2xl md:text-3xl font-light text-gray-300 mb-4">
          Precision Psychedelic Wellness
        </p>
        <p className="text-lg md:text-xl text-gray-400 mb-12 uppercase tracking-widest">
          for the Modern Explorer
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <div className="flex items-center justify-center gap-2 text-psy-neonGreen bg-white/5 px-6 py-3 rounded-full border border-psy-neonGreen/30">
            <FlaskConical className="text-xl" />
            <span className="font-medium">Research-Backed</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-psy-neonPurple bg-white/5 px-6 py-3 rounded-full border border-psy-neonPurple/30">
            <ShieldCheck className="text-xl" />
            <span className="font-medium">Safety First</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-psy-neonPink bg-white/5 px-6 py-3 rounded-full border border-psy-neonPink/30">
            <Target className="text-xl" />
            <span className="font-medium">Precise Dosing</span>
          </div>
        </div>
      </div>
    </section>
  );
}
