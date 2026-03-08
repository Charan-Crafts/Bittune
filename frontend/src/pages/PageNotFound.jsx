import React from 'react';
import { useNavigate } from 'react-router';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      {/* Icon or Illustration Placeholder */}
      <div className="mb-8">
        <div className="text-green-500 text-9xl font-black opacity-20 absolute -z-10 select-none">
          404
        </div>
        <h1 className="text-6xl font-bold mb-4 relative">Oops!</h1>
      </div>

      <div className="max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          We can’t seem to find the page you’re looking for.
        </h2>
        <p className="text-gray-400 mb-10">
          The link might be broken, or the page may have been removed. 
          Check the URL or head back to the home page.
        </p>

        <div className="flex flex-col gap-4 items-center">
          {/* Main Button */}
          <button 
            onClick={() => navigate("/")}
            className="bg-white text-black font-bold py-3 px-10 rounded-full hover:scale-105 transition duration-200 active:scale-95"
          >
            Home
          </button>

          {/* Secondary Link */}
          <button 
            onClick={() => navigate(-1)}
            className="text-white font-bold hover:underline mt-2"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-20">
        <h3 className="text-gray-600 font-black tracking-tighter text-xl uppercase">
          SpotifyClone<span className="text-green-500">®</span>
        </h3>
      </div>
    </div>
  );
}

export default PageNotFound;