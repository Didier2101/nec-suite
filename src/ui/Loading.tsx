'use client';
import { useState, useEffect, useRef } from 'react';

interface LoadingProps {
  text?: string;
  onLoadComplete?: () => void;
  minLoadTime?: number;
}

const Loading = ({
  text = 'Cargando información...',
  onLoadComplete,
  minLoadTime = 2000,
}: LoadingProps) => {
  const [progress, setProgress] = useState(0);
  const loadStartTimeRef = useRef(Date.now());
  const loadCompleteTimeRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const checkPageLoad = () => document.readyState === 'complete';

    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - loadStartTimeRef.current;

      if (checkPageLoad() && !loadCompleteTimeRef.current) {
        loadCompleteTimeRef.current = currentTime;
      }

      let calculatedProgress: number;

      if (loadCompleteTimeRef.current) {
        const totalLoadTime = Math.max(
          loadCompleteTimeRef.current - loadStartTimeRef.current,
          minLoadTime
        );
        calculatedProgress = Math.min((elapsedTime / totalLoadTime) * 100, 100);
      } else {
        const estimatedLoadTime = 5000;
        calculatedProgress = Math.min((elapsedTime / estimatedLoadTime) * 85, 85);
      }

      setProgress(Math.floor(calculatedProgress));

      if (calculatedProgress >= 100) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setTimeout(() => {
          if (onLoadComplete) onLoadComplete();
        }, 300);
      }
    };

    progressIntervalRef.current = setInterval(updateProgress, 100);

    const handleLoad = () => {
      if (!loadCompleteTimeRef.current) {
        loadCompleteTimeRef.current = Date.now();
      }
    };

    window.addEventListener('load', handleLoad);

    if (document.readyState === 'complete') {
      handleLoad();
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      window.removeEventListener('load', handleLoad);
    };
  }, [minLoadTime, onLoadComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-5xl font-extrabold text-blue-800 tracking-wide">
          NEC Suite
        </h1>

        <div className="relative inline-block">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#1E40AF"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              className="transition-all duration-300 ease-out"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-800">
              {progress}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-blue-800 text-lg font-medium">{text}</p>

          <p className="text-blue-600 text-sm">
            {progress < 30 && "Iniciando módulo..."}
            {progress >= 30 && progress < 60 && "Cargando componentes..."}
            {progress >= 60 && progress < 90 && "Preparando topología..."}
            {progress >= 90 && progress < 100 && "Finalizando..."}
            {progress === 100 && "¡Listo!"}
          </p>
        </div>

        <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;