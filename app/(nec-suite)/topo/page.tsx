'use client';

import React from 'react';

export default function Page() {
  return (
    <div className=" h-full p-6 rounded-xl shadow-lg bg-white space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Topología de Red</h2>

      {/* Etiquetas de protocolos */}
      <div className="flex flex-wrap gap-2">
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">SPF</span>
        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">OSPF v2</span>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Área 0</span>
      </div>

      {/* Iframe de topología de red (puede cambiarse por imagen o embed real) */}
      <div className="w-full h-[610px] border rounded-lg overflow-hidden">
        <iframe
          src="https://networktopology.org/embed/simple-ospf"
          title="Topología OSPF"
          className="w-full h-full"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
