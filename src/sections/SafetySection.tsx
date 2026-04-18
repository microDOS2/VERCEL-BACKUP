import { XCircle, Award, Heart, BarChart3 } from 'lucide-react';

export function SafetySection() {
  return (
    <section id="safety" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm text-psy-neonPink font-bold tracking-widest uppercase mb-2">
            Clinical Data
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold">Safety Profile & Scientific Evidence</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* High Therapeutic Index */}
          <div className="bg-psy-card p-8 rounded-2xl border border-white/5 relative overflow-hidden">
            <h4 className="text-2xl font-bold mb-6">High Therapeutic Index</h4>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-6xl font-black text-psy-neonGreen">500×</span>
              <span className="text-lg text-gray-400 uppercase pb-2">Safety Margin</span>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              Lethal dose estimated at 500 times a therapeutic dose of up to 30mg. One of the safest
              psychedelics with a remarkably wide safety window.
            </p>
            <h5 className="font-bold mt-8 mb-2">Anti-Addictive Properties</h5>
            <p className="text-gray-300 text-sm">
              Psilocybin and related tryptamines do not show evidence of addiction potential. Daily
              intake leads to loss of therapeutic benefits.
            </p>
          </div>

          {/* Clinical Study Results */}
          <div className="bg-psy-card p-8 rounded-2xl border border-white/5 relative overflow-hidden">
            <h4 className="text-2xl font-bold mb-6">Clinical Study Results</h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-psy-neonPurple/20 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-psy-neonPurple">110</span>
              </div>
              <div>
                <div className="font-bold">Healthy subjects analyzed</div>
                <div className="text-sm text-gray-400">
                  Across 8 double-blind placebo-controlled studies
                </div>
              </div>
            </div>
            <blockquote className="border-l-2 border-psy-neonPurple pl-4 italic text-sm text-gray-300 mb-6">
              "All acute adverse drug reactions were successfully managed by providing interpersonal
              support."
              <br />
              <span className="text-gray-500 mt-2 block">— Studerus et al.</span>
            </blockquote>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <XCircle className="text-psy-neonPink" /> No subsequent drug abuse
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="text-psy-neonPink" /> No persisting perception disorders
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="text-psy-neonPink" /> No prolonged psychosis
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Award className="text-psy-neonGreen" /> FDA Breakthrough Therapy
            </h4>
            <ul className="text-sm text-gray-300 space-y-3">
              <li>
                <strong>2018:</strong> Treatment-Resistant Depression
              </li>
              <li>
                <strong>2019:</strong> Major Depressive Disorder
              </li>
            </ul>
          </div>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Heart className="text-psy-neonPink" /> Mental Health
            </h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Depression & anxiety reduction</li>
              <li>• OCD symptom improvement</li>
              <li>• Addiction treatment</li>
            </ul>
          </div>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="text-psy-neonPurple" /> Key Study Results
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Mood Improvement</span>
                <strong className="text-psy-neonGreen">85%</strong>
              </div>
              <div className="w-full bg-black/50 rounded-full h-1.5">
                <div className="bg-psy-neonGreen h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex justify-between mt-2">
                <span>Anxiety Reduction</span>
                <strong className="text-psy-neonPurple">78%</strong>
              </div>
              <div className="w-full bg-black/50 rounded-full h-1.5">
                <div
                  className="bg-psy-neonPurple h-1.5 rounded-full"
                  style={{ width: '78%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
