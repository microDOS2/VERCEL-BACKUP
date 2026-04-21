export function AdvantagesSection() {
  const advantages = [
    {
      title: 'Less Mentally Intense',
      badge: 'Ideal for beginners',
      badgeColor: 'bg-psy-neonGreen/20 text-psy-neonGreen',
      description:
        'Highly visual experiences with a clearheaded, easygoing mental state compared to LSD or psilocin. Easier to navigate and manage.',
    },
    {
      title: 'Fast & Predictable',
      badge: 'Plan your day',
      badgeColor: 'bg-white/10 text-gray-300',
      description:
        'Rapid onset (~15 min) with a shorter duration (4-6 hours). Perfect for those who want a manageable time window.',
    },
    {
      title: 'Mood Enhancement',
      badge: 'Positive headspace',
      badgeColor: 'bg-psy-neonPink/20 text-psy-neonPink',
      description:
        'Consistent mood improvement and euphoria with minimal anxiety for most users. Life-affirming experiences.',
    },
    {
      title: 'Vivid Visuals',
      badge: null,
      description:
        'Bright, colorful Open Eye visuals and Closed Eye visuals with geometric patterns. One of the most visual psychedelics available.',
    },
    {
      title: 'Precise Dosing',
      badge: null,
      description:
        '2mg scored tablets allow for accurate, consistent dosing. Start low and titrate to your ideal experience.',
    },
    {
      title: 'Sensory Enhancement',
      badge: null,
      description:
        'Enhanced music appreciation, increased sociability, and pleasurable body sensations create a holistic experience.',
    },
  ];

  return (
    <section className="py-20 bg-black/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-sm text-center text-psy-neonGreen font-bold tracking-widest uppercase mb-2">
          Key Advantages
        </h2>
        <h3 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Why Choose <span className="text-psy-neonGreen">micro</span>
          <span className="text-psy-neonPurple">DOS</span>
          <span className="text-psy-neonPink">(2)</span>?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => (
            <div key={index} className="bg-psy-card p-6 rounded-xl border border-white/5 card-hover">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-bold">{advantage.title}</h4>
                {advantage.badge && (
                  <span className={`text-xs px-2 py-1 rounded ${advantage.badgeColor}`}>
                    {advantage.badge}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
