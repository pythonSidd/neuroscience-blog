import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          🧠 NeuroHub
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-gray font-medium hover:text-secondary transition">
            Home
          </Link>
          <Link href="/blog" className="text-gray font-medium hover:text-secondary transition">
            Blog
          </Link>
          <Link href="/research" className="text-gray font-medium hover:text-secondary transition">
            Research
          </Link>
          <Link href="/projects" className="text-gray font-medium hover:text-secondary transition">
            Projects
          </Link>
          <Link href="/about" className="text-gray font-medium hover:text-secondary transition">
            About
          </Link>
          <Link href="/admin" className="text-gray font-medium hover:text-secondary transition">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
