'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-white to-light">
        <div className="max-w-4xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-dark mb-4">About Me</h1>
            <p className="text-xl text-gray">
              Passionate about neuroscience, AI, and bridging the gap between biological and artificial intelligence
            </p>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-6xl text-center">🧠</div>
              <div>
                <h2 className="text-3xl font-bold text-dark mb-4">Hi, I'm [Your Name]</h2>
                <p className="text-gray mb-4 leading-relaxed">
                  I'm a high school student fascinated by the complexities of the human brain and how we can use artificial intelligence to understand it better. This blog is my space to explore, learn, and share insights about neuroscience.
                </p>
                <p className="text-gray leading-relaxed">
                  My interests span from molecular neurobiology to computational neuroscience, and I'm constantly exploring how machine learning can help us decode neural mechanisms.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-dark mb-8">Journey & Milestones</h2>
            <div className="space-y-8">
              {[
                {
                  year: '2024',
                  title: 'Launched This Blog',
                  description: 'Started documenting my neuroscience journey and AI explorations.',
                },
                {
                  year: '2023',
                  title: 'Won Science Fair',
                  description: 'Project on neural network visualization won first place at regional science fair.',
                },
                {
                  year: '2023',
                  title: 'Started Research Project',
                  description: 'Began work analyzing EEG data from cognitive tasks.',
                },
                {
                  year: '2022',
                  title: 'Deep Dive into Neuroscience',
                  description: 'Completed online courses in neurobiology and brain imaging techniques.',
                },
                {
                  year: '2021',
                  title: 'Introduction to Programming',
                  description: 'Started learning Python and JavaScript for scientific computing.',
                },
              ].map((milestone, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">
                      ✓
                    </div>
                    {idx < 4 && <div className="w-1 h-24 bg-light" />}
                  </div>
                  <div className="pb-8">
                    <span className="text-accent font-bold text-lg">{milestone.year}</span>
                    <h3 className="text-xl font-bold text-dark mt-1">{milestone.title}</h3>
                    <p className="text-gray mt-2">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              {
                icon: '🧬',
                title: 'Molecular Neuroscience',
                description: 'DNA, proteins, and molecular mechanisms underlying brain function and neurological disorders.',
              },
              {
                icon: '🔬',
                title: 'Brain Imaging',
                description: 'Techniques like fMRI, EEG, and PET to visualize and understand brain activity.',
              },
              {
                icon: '🤖',
                title: 'AI & Neuroscience',
                description: 'How machine learning and neural networks can help us understand biological brains.',
              },
              {
                icon: '💭',
                title: 'Consciousness',
                description: 'The hard problem and theories explaining how subjective experience emerges from neural activity.',
              },
              {
                icon: '📚',
                title: 'Computational Neuroscience',
                description: 'Mathematical models and simulations of neural systems and brain functions.',
              },
              {
                icon: '🏥',
                title: 'Clinical Applications',
                description: 'How neuroscience research translates to treatments for brain disorders and disabilities.',
              },
            ].map((interest, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
                <div className="text-4xl mb-3">{interest.icon}</div>
                <h3 className="text-lg font-bold text-dark mb-2">{interest.title}</h3>
                <p className="text-gray">{interest.description}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-dark mb-8">Skills & Tools</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  category: 'Programming',
                  skills: ['Python', 'JavaScript', 'TypeScript', 'React'],
                },
                {
                  category: 'Scientific Tools',
                  skills: ['MATLAB', 'NumPy', 'Pandas', 'Scikit-learn'],
                },
                {
                  category: 'Hardware',
                  skills: ['EEG Recording', 'Arduino', 'Raspberry Pi', 'Lab Equipment'],
                },
              ].map((skillGroup, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-dark mb-4">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-light text-dark text-sm rounded-full font-semibold hover:bg-primary hover:text-white transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Let's Connect!</h2>
            <p className="text-lg mb-6">
              I love connecting with others interested in neuroscience, AI, and open source projects.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-light transition">
                📧 Email
              </a>
              <a href="#" className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-light transition">
                🐙 GitHub
              </a>
              <a href="#" className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-light transition">
                💼 LinkedIn
              </a>
              <a href="#" className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-light transition">
                🐦 Twitter
              </a>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 p-8 bg-light rounded-lg border-2 border-primary">
            <h3 className="text-2xl font-bold text-dark mb-3">Share Your Ideas</h3>
            <p className="text-gray mb-4">
              Have a neuroscience topic you'd like me to explore? Send me ideas via WhatsApp or Telegram, and I'll research and write about it!
            </p>
            <button className="btn-primary">Start a Conversation</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
