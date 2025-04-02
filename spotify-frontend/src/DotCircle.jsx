import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

// Function to lerp between two colors based on phi
const lerpColor = (color1, color2, factor) => {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  return c1.lerp(c2, factor);
};

const DotSphere = ({
  dotCount = 150,
  radius = 5,
  speed = 0.5,
  waveAmplitude = 1,
  waveFrequency = 2,
  waveRange = 0.5, // Range of phi where the wave effect will occur
  color1 = "#ff0000", // Lighter color (middle of the sphere)
  color2 = "#8e0000", // Darker color (edges of the sphere)
  glowIntensity = 0.5, // Intensity of the glow
  glowColor = "#ff0000", // Glow color (matches the dot color)
}) => {
  const { camera } = useThree();
  const dotsRef = useRef([]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * speed;

    dotsRef.current.forEach((dot, i) => {
      if (!dot) return;

      const phi = Math.acos(1 - (2 * i) / dotCount); // Latitude
      const theta = Math.PI * (1 + Math.sqrt(5)) * i + time; // Longitude

      const x = radius * Math.sin(phi) * Math.cos(theta);
      let y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      // Only apply wave motion to dots in the middle range of the sphere
      if (phi > Math.PI / 2 - waveRange && phi < Math.PI / 2 + waveRange) {
        // Apply wave effect to y-position
        y += waveAmplitude * Math.sin(waveFrequency * theta + time);
      }

      // Calculate the color based on the phi angle for the gradient
      const colorFactor = 1 - (phi / Math.PI); // Calculate factor for color gradient (1 at the middle, 0 at the edge)
      const color = lerpColor(color1, color2, colorFactor);

      // Culling: Only show front-facing dots
      const cameraDirection = [0, 0, 1];
      const dotPosition = [x, y, z];
      const dotProduct =
        dotPosition[0] * cameraDirection[0] +
        dotPosition[1] * cameraDirection[1] +
        dotPosition[2] * cameraDirection[2];

      dot.visible = dotProduct > 0; // Hide back-facing dots
      dot.position.set(x, y, z);

      // Update the dot's color
      dot.material.color.set(color);
    });
  });

  return (
    <group>
      {Array.from({ length: dotCount }).map((_, i) => {
        const phi = Math.acos(1 - (2 * i) / dotCount); // Latitude
        const colorFactor = 1 - (phi / Math.PI); // Calculate factor for color gradient
        const color = lerpColor(color1, color2, colorFactor); // Interpolate between the two colors

        return (
          <Sphere
            key={i}
            ref={(el) => (dotsRef.current[i] = el)}
            args={[0.1, 8, 8]}
          >
            <meshStandardMaterial
              attach="material"
              color={color}
              emissive={glowColor}
              emissiveIntensity={glowIntensity}
              roughness={0.4}
              metalness={0.8}
            />
          </Sphere>
        );
      })}
    </group>
  );
};

const Scene = ({
        speed=.35,
        radius=4,
        dotCount=150,
        waveAmplitude=0.5,
        waveFrequency=5,
        waveRange=0.8,
        color1="#23691b", 
        color2="#11330d", 
        glowIntensity=2,
        glowColor="#23691b"
}) => {
  return (
    <div style={{ width: "50vw", height: "80vh", zIndex:-1}}>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <DotSphere
            radius={5}
            dotCount={150}
            speed={speed}
            waveAmplitude={waveAmplitude}
            waveFrequency={waveFrequency}
            waveRange={waveRange}
            color1={color1} // Lighter color at the middle
            color2={color2} // Darker color at the edge
            glowIntensity={glowIntensity}
            glowColor={glowColor} // Glow matches the color1
        />
      </Canvas>
    </div>
  );
};

export default Scene;
