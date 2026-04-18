import { Eye, Smile, Music, Users, Waves, Zap, Aperture, Brain } from 'lucide-react';

export function ExperienceSection() {
  const positiveEffects = [
    { icon: Eye, text: 'Open & closed eye visuals' },
    { icon: Smile, text: 'Increased humor & laughter' },
    { icon: Music, text: 'Music enhancement' },
    { icon: Users, text: 'Increased sociability' },
    { icon: Waves, text: 'Pleasurable body sensations' },
    { icon: Zap, text: 'Increased energy' },
    { icon: Aperture, text: 'Bright, colorful patterns' },
    { icon: Brain, text: 'Clear mental state' },
  ];

  const timeline = [
    { phase: 'Onset', time: '15-30 min', description: 'First bodily sensations', color: 'psy-neonGreen' },
    { phase: 'Peak', time: '1.5-2 hrs', description: 'Maximum effects', color: 'psy-neonPurple' },
    { phase: 'Duration', time: '4-6 hrs', description: 'Return to baseline', color: 'psy-neonPink' },
  ];

  return (
    <section id="experience" className="py-20 bg-black/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          What to Expect from <span className="text-psy-neonGreen">micro</span>
          <span className="text-psy-neonPurple">DOS</span>
          <span className="text-psy-neonPink">(2)</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Positive Effects */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-psy-neonPurple">Positive Effects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {positiveEffects.map((effect, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-psy-card p-4 rounded-lg border border-white/5"
                >
                  <effect.icon className="text-psy-neonPurple text-xl" />
                  <span className="text-sm">{effect.text}</span>
                </div>
              ))}
            </div>
            <div className="bg-psy-card border-l-4 border-psy-neonPink p-6 rounded-r-lg">
              <h4 className="font-bold mb-2">Visual Characteristics</h4>
              <p className="text-sm text-gray-300">
                Known for very colorful open eye visuals—surfaces breathe and move, boundaries
                between objects reduce.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-psy-neonGreen">Timeline</h3>
            <div className="relative border-l border-white/20 ml-4 space-y-8 pb-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative">
                  <div
                    className={`absolute -left-[25px] bg-psy-dark border-2 border-${item.color} w-4 h-4 rounded-full mt-1.5`}
                  ></div>
                  <div className="pl-6">
                    <h4 className="font-bold text-lg text-white">
                      {item.phase}{' '}
                      <span className={`text-sm font-normal text-${item.color} ml-2`}>
                        {item.time}
                      </span>
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
