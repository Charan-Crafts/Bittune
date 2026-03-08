import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { setupLoaderInterceptors } from "../utils/loaderInterceptor";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const countRef = useRef(0);

  const showLoader = useCallback(() => {
    countRef.current += 1;
    setLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    countRef.current = Math.max(countRef.current - 1, 0);
    if (countRef.current === 0) setLoading(false);
  }, []);

  useEffect(() => {
    const cleanup = setupLoaderInterceptors(showLoader, hideLoader);
    return cleanup;
  }, [showLoader, hideLoader]);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}

      {/* Fullscreen Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            {/* Spotify-style bouncing bars */}
            <div className="flex items-end gap-1 h-12">
              <span className="w-2 bg-green-500 rounded-sm animate-[bounce_0.6s_ease-in-out_infinite_0ms]" style={{ height: '60%' }} />
              <span className="w-2 bg-green-500 rounded-sm animate-[bounce_0.6s_ease-in-out_infinite_150ms]" style={{ height: '100%' }} />
              <span className="w-2 bg-green-500 rounded-sm animate-[bounce_0.6s_ease-in-out_infinite_300ms]" style={{ height: '40%' }} />
              <span className="w-2 bg-green-500 rounded-sm animate-[bounce_0.6s_ease-in-out_infinite_450ms]" style={{ height: '80%' }} />
            </div>
            <p className="text-sm text-gray-400 font-semibold tracking-widest uppercase">Loading...</p>
          </div>
        </div>
      )}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  return useContext(LoaderContext);
};
