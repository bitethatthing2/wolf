import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();
  
  const handleReturnHome = () => {
    router.push('/');
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button 
          onClick={handleReturnHome}
          className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-md text-white bg-black hover:bg-white/10 transition duration-200"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
