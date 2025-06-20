'use client';

const Loading = ({ text = 'Cargando información...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-6">
        {/* NEC Suite Title */}
        <h1 className="text-4xl font-extrabold text-blue-800 tracking-wide animate-pulse">
          NEC Suite
        </h1>

        {/* Loading Spinner */}
        <div className="relative inline-block">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-800"></div>
          <span className="absolute inset-0 flex items-center justify-center font-bold text-blue-800">
            ...
          </span>
        </div>

        {/* Text */}
        <p className="text-blue-800 text-lg font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
