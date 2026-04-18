import { Brain, ShieldPlus, TrendingUp, CheckCircle } from 'lucide-react';

export function MechanismSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm text-psy-neonPurple font-bold tracking-widest uppercase mb-2">
            Mechanism of Action
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold">The Science of Clarity</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-psy-card border border-psy-neonPurple/20 p-8 rounded-2xl card-hover relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-psy-neonPurple/10 rounded-bl-full"></div>
            <Brain className="w-10 h-10 text-psy-neonPurple mb-4" />
            <h4 className="text-xl font-bold mb-2">Serotonin Receptor Engagement</h4>
            <p className="text-sm text-gray-400 font-bold uppercase mb-3">Primary Mechanism</p>
            <p className="text-gray-300 text-sm">
              Metocin engages serotonin receptors, notably the <strong>5-HT2A receptor</strong>,
              similar to psilocin. This interaction yields psychedelic changes in perception, mood,
              and cognition while maintaining a clear, energetic headspace.
            </p>
          </div>

          <div className="bg-psy-card border border-psy-neonGreen/20 p-8 rounded-2xl card-hover relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-psy-neonGreen/10 rounded-bl-full"></div>
            <ShieldPlus className="w-10 h-10 text-psy-neonGreen mb-4" />
            <h4 className="text-xl font-bold mb-2">Anti-Inflammatory</h4>
            <p className="text-sm text-gray-400 font-bold uppercase mb-3">Systemic Response</p>
            <p className="text-gray-300 text-sm">
              Blocks TNF-α, IL-1β, and IL-6 cytokines through 5-HT2A activation, providing
              significant anti-inflammatory pathways.
            </p>
          </div>

          <div className="bg-psy-card border border-psy-neonPink/20 p-8 rounded-2xl card-hover relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-psy-neonPink/10 rounded-bl-full"></div>
            <TrendingUp className="w-10 h-10 text-psy-neonPink mb-4" />
            <h4 className="text-xl font-bold mb-2">Neuroplasticity</h4>
            <p className="text-sm text-gray-400 font-bold uppercase mb-3">Cellular Growth</p>
            <p className="text-gray-300 text-sm">
              Enhances BDNF (Brain-Derived Neurotrophic Factor) stimulation, promoting synaptic
              growth and neural connectivity.
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">What It Does</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-psy-neonGreen text-xl mt-1 shrink-0" />
                  <span>Modulates mood and emotional processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-psy-neonGreen text-xl mt-1 shrink-0" />
                  <span>Enhances cognitive flexibility and creativity</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-psy-neonGreen text-xl mt-1 shrink-0" />
                  <span>Alters sensory perception and visual processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-psy-neonGreen text-xl mt-1 shrink-0" />
                  <span>Reduces activity in the default mode network (DMN)</span>
                </li>
              </ul>
            </div>
            <div className="bg-psy-dark p-8 rounded-xl border border-psy-neonPurple/30">
              <h4 className="text-sm uppercase tracking-widest text-psy-neonPurple mb-4 font-bold">
                User Reports
              </h4>
              <blockquote className="text-xl italic font-light leading-relaxed">
                "Users often report a clear, energetic headspace with vivid sensory enhancement—a
                uniquely manageable psychedelic experience."
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
