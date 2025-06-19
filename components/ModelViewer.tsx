'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import React, { Suspense } from 'react';

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={6} />; // 👈 Ajusta la escala aquí
}

export default function ModelViewer({ url }: { url: string }) {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas camera={{ position: [0, 0, 2] }}> {/* 👈 Acerca la cámara */}
                <ambientLight intensity={1.2} />
                <directionalLight position={[3, 3, 3]} />
                <Suspense fallback={null}>
                    <Model url={url} />
                </Suspense>
                <OrbitControls />
            </Canvas>
        </div>
    );
}
