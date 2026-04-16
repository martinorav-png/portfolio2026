/* eslint-disable react/no-unknown-property */
/**
 * FluidGlass — lens hero background.
 * Renders a pastel background (matching the CSS hero orbs) inside the FBO
 * scene so the glass lens has real colour to refract.
 */
import * as THREE from 'three';
import { useRef, useState, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO, useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';

// Matches --color-bg + the three CSS orb colours exactly
const BG_COLOR = new THREE.Color('#fafafa');

interface LensSceneProps {
  ior?: number;
  thickness?: number;
  chromaticAberration?: number;
  anisotropy?: number;
  scale?: number;
}

const LensScene = memo(function LensScene({
  ior = 1.15,
  thickness = 5,
  chromaticAberration = 0.1,
  anisotropy = 0.01,
  scale = 0.25,
}: LensSceneProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const { nodes } = useGLTF('/assets/3d/lens.glb') as unknown as {
    nodes: Record<string, THREE.Mesh>;
  };
  const buffer = useFBO();
  const [scene] = useState(() => {
    const s = new THREE.Scene();
    s.background = BG_COLOR;
    return s;
  });
  const { viewport: vp } = useThree();

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = (pointer.x * v.width) / 2;
    const destY = (pointer.y * v.height) / 2;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(
        <>
          {/* Orb 1 — purple, top-left */}
          <mesh position={[-4, 2.5, 13]}>
            <sphereGeometry args={[2.8, 32, 32]} />
            <meshBasicMaterial color="#b794f6" transparent opacity={0.55} />
          </mesh>
          {/* Orb 2 — teal, bottom-right */}
          <mesh position={[4, -2, 13]}>
            <sphereGeometry args={[2.4, 32, 32]} />
            <meshBasicMaterial color="#63d5db" transparent opacity={0.5} />
          </mesh>
          {/* Orb 3 — orange, bottom-left */}
          <mesh position={[-2, -3, 12]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color="#ffa94d" transparent opacity={0.45} />
          </mesh>
        </>,
        scene
      )}

      {/* Full-screen quad showing the FBO — this IS the hero background */}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} />
      </mesh>

      {/* The glass lens */}
      <mesh
        ref={ref}
        scale={scale}
        rotation-x={Math.PI / 2}
        geometry={nodes['Cylinder']?.geometry}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior}
          thickness={thickness}
          anisotropy={anisotropy}
          chromaticAberration={chromaticAberration}
          transmission={1}
          roughness={0}
        />
      </mesh>
    </>
  );
});

export default function FluidGlass(props: LensSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 15 }}
      gl={{ alpha: true, antialias: true }}
    >
      <LensScene {...props} />
    </Canvas>
  );
}
