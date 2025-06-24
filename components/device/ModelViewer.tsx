// components/ModelViewer.tsx
import { useGLTF } from '@react-three/drei';

interface ModelViewerProps {
    path: string;
}

export const ModelViewer = ({ path }: ModelViewerProps) => {
    const { scene } = useGLTF(path);
    return <primitive object={scene} scale={0.5} />;
};