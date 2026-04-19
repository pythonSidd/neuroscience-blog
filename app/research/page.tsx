'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ResearchPage() {
  const research = [
    {
      id: 1,
      title: 'Neuroplasticity and Learning: How the Brain Rewires Itself',
      authors: 'Smith et al.',
      year: 2023,
      url: '#',
      category: 'neuroscience',
      summary: 'Explores the mechanisms of neuroplasticity and how the brain adapts through learning experiences.',
    },
    {
      id: 2,
      title: 'Deep Learning in Computational Neuroscience',
      authors: 'Johnson & Lee',
      year: 2023,
      url: '#',
      category: 'ai',
      summary: 'Bridge between artificial neural networks and biological brain models using deep learning techniques.',
    },
    {
      id: 3,
      title: 'The Role of Dopamine in Memory Formation',
      authors: 'Williams et al.',
      year: 2022,
      url: '#',
      category: 'neuroscience',
      summary: 'Investigation into dopamine\'s crucial role in memory consolidation and recall processes.',
    },
    {
      id: 4,
      title: 'Consciousness: Integration Information Theory',
      authors: 'Tononi',
      year: 2023,
      url: '#',
      category: 'philosophy',
      summary: 'Theoretical framework for understanding consciousness through integrated information.',
    },
    {
      id: 5,
      title: 'Brain-Computer Interfaces: Current State and Future',
      authors: 'Brown & Martinez',
      year: 2023,
      url: '#',
      category: 'technology',
      summary: 'Comprehensive review of BCI technology and applications in medical and research domains.',
    },
    {
      id: 6,
      title: 'Synaptic Plasticity and Long-Term Potentiation',
      authors: 'Chen et al.',
      year: 2023,
      url: '#',
      category: 'neuroscience',
      summary: 'Detailed analysis of molecular mechanisms underlying synaptic strengthening and learning.',
    },
  ];

  const categories = ['neuroscience', 'ai', 'philosophy', 'technology'];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-white to-light">
        <div className="max-w-4xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-dark mb-4">📚 Research Papers</h1>
            <p className="text-xl text-gray">
              A curated collection of scientific papers and research exploring neuroscience, artificial intelligence, and consciousness.
            </p>
          </div>

          {/* Category Navigation */}
          <div className="mb-8 flex flex-wrap gap-2">
            {['all', ...categories].map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 rounded-full bg-light text-dark hover:bg-primary hover:text-white transition"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Research Papers Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {research.map((paper) => (
              <div
                key={paper.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-primary"
              >
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-light text-dark text-sm font-semibold rounded-full">
                    {paper.category}
                  </span>
                  <p className="text-xs text-gray mt-2">{paper.year}</p>
                </div>
                <h3 className="text-lg font-bold text-dark mb-2 leading-tight">
                  {paper.title}
                </h3>
                <p className="text-sm text-gray mb-2">{paper.authors}</p>
                <p className="text-sm text-gray mb-4">{paper.summary}</p>
                <a
                  href={paper.url}
                  className="text-primary font-semibold hover:text-secondary transition"
                >
                  Read Paper →
                </a>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Found a Great Paper?</h2>
            <p className="mb-4">
              Share your research recommendations via WhatsApp or Telegram, and I might write a blog post about it!
            </p>
            <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-light transition">
              Send Suggestion
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
