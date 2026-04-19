export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex gap-8 justify-center mb-8">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition">
            LinkedIn
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition">
            Twitter
          </a>
          <a href="mailto:contact@example.com" className="hover:text-secondary transition">
            Email
          </a>
        </div>
        <div className="text-center text-gray">
          <p>© 2026 NeuroHub | All rights reserved | Exploring neuroscience, one blog post at a time</p>
        </div>
      </div>
    </footer>
  );
}
