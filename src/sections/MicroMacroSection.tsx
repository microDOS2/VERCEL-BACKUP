import { Check } from 'lucide-react';

export function MicroMacroSection() {
  return (
    <section className="py-20 bg-black/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Microdosing vs Macrodosing
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Microdosing */}
          <div className="bg-psy-card border border-white/10 p-8 rounded-2xl">
            <h3 className="text-3xl font-bold mb-2 text-psy-neonGreen">Microdosing</h3>
            <p className="text-gray-400 uppercase tracking-widest text-sm mb-8">
              Sub-Hallucinogenic Doses
            </p>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-white mb-1">Dosage</h4>
                <p className="text-gray-300 text-sm">
                  0.5-1 tab (1-2mg) — quarter or half tablets for gentler effects
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Schedule</h4>
                <p className="text-gray-300 text-sm">
                  3x weekly or 4 days on, 3 days off. No daily tolerance buildup.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-3">Benefits:</h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="text-psy-neonGreen" /> Improved mood & focus
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-psy-neonGreen" /> Enhanced creativity
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-psy-neonGreen" /> Decreased anxiety & stress
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-psy-neonGreen" /> Daily wellness without intoxication
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-psy-neonGreen" /> No perceptual disturbances
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="text-gray-400 text-sm">Best for: </span>
                <strong className="text-psy-neonGreen">Daily optimization</strong>
              </div>
            </div>
          </div>

          {/* Macrodosing */}
          <div className="bg-psy-card border border-white/10 p-8 rounded-2xl">
            <h3 className="text-3xl font-bold mb-2 text-psy-neonPurple">Macrodosing</h3>
            <p className="text-gray-400 uppercase tracking-widest text-sm mb-8">
              Full Psychedelic Experiences
            </p>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-white mb-1">Dosage</h4>
                <p className="text-gray-300 text-sm">
                  2-6+ tabs (4-12mg+) — full therapeutic or recreational doses
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Duration</h4>
                <p className="text-gray-300 text-sm">
                  4-6 hours of immersive experience with 1.5-2 hour peak
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-3">Benefits:</h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="text-psy-neonPurple" /> Deep introspection & insight
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-psy-neonPurple" /> Personal growth & healing
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-psy-neonPurple" /> Transcendental experiences
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-psy-neonPurple" /> Strong visual & sensory effects
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-psy-neonPurple" /> Breakthrough moments
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="text-gray-400 text-sm">Best for: </span>
                <strong className="text-psy-neonPurple">Transformational journeys</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-t border-white/10 pt-12">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">47%</div>
            <p className="text-gray-400 text-sm uppercase tracking-wide">
              of psilocybin users microdose
            </p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">271K+</div>
            <p className="text-gray-400 text-sm uppercase tracking-wide">
              online community members
            </p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">8M</div>
            <p className="text-gray-400 text-sm uppercase tracking-wide">
              Americans used psilocybin (2023)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
