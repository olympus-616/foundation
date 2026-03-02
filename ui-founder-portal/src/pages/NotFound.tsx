import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <p className="font-mono text-6xl text-light-gray mb-4">404</p>
      <h1 className="font-serif text-2xl text-navy mb-4">Page Not Found</h1>
      <p className="text-medium-gray font-sans mb-8">The page you are looking for does not exist.</p>
      <Link to="/" className="text-gold font-sans hover:underline">
        Return to Overview
      </Link>
    </div>
  );
}
