'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: 'Neural Network Visualization',
      description: 'Interactive 3D visualization tool for neural networks with real-time training visualization.',
      tech: ['React', 'Three.js', 'TensorFlow.js'],
      github: '#',
      demo: '#',
      image: '🧠',
      stars: 245,
    },
    {
      id: 2,
      title: 'Brain Activity Analyzer',
      description: 'Python package for analyzing EEG data with machine learning models for anomaly detection.',
      tech: ['Python', 'NumPy', 'Scikit-learn'],
      github: '#',
      demo: '#',
      image: '🔧',
      stars: 128,
    },
    {
      id: 3,
      title: 'Cognitive Task Game',
      description: 'Browser-based game designed to test memory, attention, and processing speed with data collection.',
      tech: ['Next.js', 'TypeScript', 'PostgreSQL'],
      github: '#',
      demo: '#',
      image: '🎮',
      stars: 89,
    },
    {
      id: 4,
      title: 'Research Paper Parser',
      description: 'Tool to automatically extract metadata, abstracts, and citations from neuroscience research papers.',
      tech: ['Python', 'PyPDF2', 'spaCy'],
      github: '#',
      demo: '#',
      image: '📄',
      stars: 156,
    },
    {
      id: 5,
      title: 'Synapse Learning Platform',
      description: 'Interactive education platform with animations explaining neuroscience concepts and synaptic plasticity.',
      tech: ['React', 'Framer Motion', 'Canvas API'],
      github: '#',
      demo: '#',
      image: '🎓',
      stars: 203,
    },
    {
      id: 6,
      title: 'Brain Data Dashboard',
      description: 'Real-time dashboard for monitoring and visualizing neuroimaging data from research studies.',
      tech: ['Vue.js', 'D3.js', 'WebSocket'],
      github: '#',
      demo: '#',
      image: '📊',
      stars: 92,
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-white to-light">
        <div className="max-w-6xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-dark mb-4">💻 Projects & Portfolio</h1>
            <p className="text-xl text-gray max-w-2xl mx-auto">
              Exploring the intersection of neuroscience, computer science, and artificial intelligence through code.
            </p>
          </div>

          {/* Featured Project */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12 border-l-4 border-accent">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="flex items-center justify-center text-6xl">🚀</div>
              <div>
                <span className="text-accent font-semibold">FEATURED</span>
                <h2 className="text-3xl font-bold text-dark mt-2 mb-3">Neural Network Visualization</h2>
                <p className="text-gray mb-4">
                  An interactive 3D visualization tool that brings neural networks to life. Watch networks train in real-time, explore activation patterns, and understand how deep learning models work.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['React', '3D Graphics', 'ML'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-light text-dark text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href="#" className="btn-primary">
                    View on GitHub
                  </a>
                  <a href="#" className="btn-secondary">
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden hover:-translate-y-1"
              >
                {/* Image/Icon Area */}
                <div className="h-40 bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl">
                  {project.image}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-dark mb-2">{project.title}</h3>
                  <p className="text-sm text-gray mb-4">{project.description}</p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-light text-dark text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Stats & Links */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray">⭐ {project.stars}</span>
                      <div className="flex gap-2">
                        <a
                          href={project.github}
                          className="text-primary hover:text-secondary font-semibold text-sm"
                        >
                          Code
                        </a>
                        <a
                          href={project.demo}
                          className="text-secondary hover:text-primary font-semibold text-sm"
                        >
                          Demo →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-secondary to-primary rounded-lg p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-3">Open Source Contributions</h2>
                <p className="mb-4">
                  Passionate about open source and collaborative learning. Check out my GitHub for contributions to various neuroscience and ML projects.
                </p>
                <a
                  href="#"
                  className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-light transition"
                >
                  View GitHub Profile
                </a>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">Looking to Collaborate?</h2>
                <p className="mb-4">
                  Interested in contributing to any of these projects or have an idea for collaboration?
                </p>
                <a
                  href="#"
                  className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-light transition"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
