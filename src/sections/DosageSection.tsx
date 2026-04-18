import { Info, Circle } from 'lucide-react';

export function DosageSection() {
  const dosageLevels = [
    {
      name: 'LIGHT',
      tabs: '1 tab',
      mg: '2mg',
      color: 'psy-neonGreen',
      borderColor: 'border-green-900/50',
      barColor: 'bg-psy-neonGreen',
      effects: ['Social & playful', 'Subtle lift', 'Great for beginners'],
      equivalent: '≈ ½ gram dried mushrooms',
    },
    {
      name: 'MODERATE',
      tabs: '2 tabs',
      mg: '4mg',
      color: 'blue-400',
      borderColor: 'border-blue-900/50',
      barColor: 'bg-blue-400',
      effects: ['Noticeable effects', 'Gentle visuals', 'Enhanced mood'],
      equivalent: '≈ 1 gram dried mushrooms',
    },
    {
      name: 'TRIPPY',
      tabs: '4 tabs',
      mg: '8mg',
      color: 'psy-neonPurple',
      borderColor: 'border-purple-900/50',
      barColor: 'bg-psy-neonPurple',
      effects: ['Clear trip characteristics', 'Strong perceptual changes', 'Vivid visuals'],
      equivalent: '≈ 2 grams dried mushrooms',
    },
    {
      name: 'TRANSCEND',
      tabs: '6+ tabs',
      mg: '12mg+',
      color: 'psy-neonPink',
      borderColor: 'border-pink-900/50',
      barColor: 'bg-psy-neonPink',
      effects: ['Deep experiences', 'Transcendental states', 'Experienced users only'],
      equivalent: '≈ 3+ grams dried mushrooms',
    },
  ];

  return (
    <section id="dosage" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-sm text-center text-psy-neonPurple font-bold tracking-widest uppercase mb-2">
          Dosage Guide
        </h2>
        <h3 className="text-3xl md:text-5xl font-bold text-center mb-4">
          Find Your Personalized Journey
        </h3>
        <p className="text-center text-gray-400 mb-16">
          Each <span className="text-psy-neonGreen">micro</span>
          <span className="text-psy-neonPurple">DOS</span>
          <span className="text-psy-neonPink">(2)</span> tablet contains 2mg of Metocin
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {dosageLevels.map((level, index) => (
            <div
              key={index}
              className={`bg-psy-card border ${level.borderColor} p-6 rounded-2xl relative`}
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 ${level.barColor} rounded-t-2xl opacity-50`}
              ></div>
              <h4 className="text-2xl font-bold mb-1">{level.name}</h4>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-xl">{level.tabs}</span>
                <span className={`text-${level.color} font-bold`}>{level.mg}</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-300 min-h-[100px]">
                {level.effects.map((effect, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Circle className={`w-2 h-2 fill-current text-${level.color}`} />
                    {effect}
                  </li>
                ))}
              </ul>
              <div className="text-xs text-gray-500 pt-4 border-t border-white/10">
                {level.equivalent}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4 max-w-3xl mx-auto">
          <Info className="text-2xl text-psy-neonGreen shrink-0 mt-1" />
          <div>
            <h5 className="font-bold text-lg mb-1">Pro Tip</h5>
            <p className="text-gray-300 text-sm">
              Start low and assess. Quarter- or half-tab microdosing provides gentler effects for
              daily wellness. Effects typically begin around 1-2mg.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
