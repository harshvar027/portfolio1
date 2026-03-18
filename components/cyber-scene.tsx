"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Text, Html, MeshTransmissionMaterial, useTexture, Stars } from "@react-three/drei"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { useRef, useMemo, useState, useEffect } from "react"
import * as THREE from "three"

// Particle system for background
function ParticleField({ count = 500, scrollProgress }: { count?: number; scrollProgress: number }) {
  const mesh = useRef<THREE.Points>(null)
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
      
      // Random neon colors
      const colorChoice = Math.random()
      if (colorChoice < 0.33) {
        // Cyan
        colors[i * 3] = 0.2
        colors[i * 3 + 1] = 0.9
        colors[i * 3 + 2] = 1
      } else if (colorChoice < 0.66) {
        // Magenta
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.2
        colors[i * 3 + 2] = 0.8
      } else {
        // Blue
        colors[i * 3] = 0.4
        colors[i * 3 + 1] = 0.4
        colors[i * 3 + 2] = 1
      }
    }
    
    return [positions, colors]
  }, [count])
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02
      mesh.current.rotation.x = state.clock.elapsedTime * 0.01
      mesh.current.position.z = -scrollProgress * 10
    }
  })
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// Floating geometric shapes
function FloatingShapes({ mousePosition, scrollProgress }: { mousePosition: { x: number; y: number }; scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1 + mousePosition.x * 0.3
      groupRef.current.rotation.x = mousePosition.y * 0.2
      groupRef.current.position.z = -scrollProgress * 15
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Octahedron */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[-4, 2, -3]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#00f5ff"
            emissive="#00f5ff"
            emissiveIntensity={0.5}
            wireframe
          />
        </mesh>
      </Float>
      
      {/* Torus */}
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.3}>
        <mesh position={[5, -1, -4]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1, 0.3, 16, 32]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={0.4}
            wireframe
          />
        </mesh>
      </Float>
      
      {/* Icosahedron */}
      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.6}>
        <mesh position={[3, 3, -5]}>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color="#5555ff"
            emissive="#5555ff"
            emissiveIntensity={0.5}
            wireframe
          />
        </mesh>
      </Float>
      
      {/* Dodecahedron */}
      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.4}>
        <mesh position={[-5, -2, -6]}>
          <dodecahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color="#00ffaa"
            emissive="#00ffaa"
            emissiveIntensity={0.4}
            wireframe
          />
        </mesh>
      </Float>
      
      {/* Tetrahedron */}
      <Float speed={1.2} rotationIntensity={0.7} floatIntensity={0.5}>
        <mesh position={[0, -3, -4]}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#ff5500"
            emissive="#ff5500"
            emissiveIntensity={0.4}
            wireframe
          />
        </mesh>
      </Float>
    </group>
  )
}

// Glowing ring
function GlowingRing({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })
  
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <torusGeometry args={[2, 0.02, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  )
}

// Hero section with name
function HeroSection({ scrollProgress, visible, isMobile }: { scrollProgress: number; visible: boolean; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const opacity = visible ? Math.max(0, 1 - scrollProgress * 4) : 0
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })
  
  if (opacity <= 0) return null
  
  const titleSize = isMobile ? 0.8 : 1.5
  const subtitleSize = isMobile ? 0.18 : 0.3
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text
          fontSize={titleSize}
          position={[0, 0.5, 0]}
          color="#00f5ff"
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
        >
          Haarshu.exe
          <meshStandardMaterial
            color="#00f5ff"
            emissive="#00f5ff"
            emissiveIntensity={0.8}
            toneMapped={false}
            transparent
            opacity={opacity}
          />
        </Text>
        <Text
          fontSize={subtitleSize}
          position={[0, -0.5, 0]}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Currently Learning Developer
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
            toneMapped={false}
            transparent
            opacity={opacity}
          />
        </Text>
      </Float>
      
      <GlowingRing position={[0, 0, -2]} color="#00f5ff" scale={isMobile ? 1 : 1.5} />
      <GlowingRing position={[0, 0, -3]} color="#ff00ff" scale={isMobile ? 1.3 : 2} />
    </group>
  )
}

// About section
function AboutSection({ scrollProgress, isMobile }: { scrollProgress: number; isMobile: boolean }) {
  const sectionProgress = (scrollProgress - 0.2) * 4
  const visible = sectionProgress > 0 && sectionProgress < 2
  const opacity = visible ? Math.min(1, sectionProgress) * Math.max(0, 2 - sectionProgress) : 0
  
  if (opacity <= 0) return null
  
  const titleSize = isMobile ? 0.4 : 0.6
  
  return (
    <group position={[0, 0, -15]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          fontSize={titleSize}
          position={[0, 4, 0]}
          color="#ff00ff"
          anchorX="center"
          anchorY="middle"
        >
          About Me
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={0.8}
            toneMapped={false}
            transparent
            opacity={opacity}
          />
        </Text>
      </Float>
      
      <Html position={[0, 1, 0]} center transform distanceFactor={8}>
        <div 
          className="text-center transition-opacity duration-300"
          style={{ opacity, width: 'min(500px, 85vw)' }}
        >
          <p className="text-sm leading-relaxed text-foreground/90 sm:text-lg">
            I{"'"}m currently learning new stuff with coding — exploring different languages and technologies.
            This site is one of the projects I built to push my limits and explore what{"'"}s possible.
            Always building, always learning.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:mt-6 sm:gap-4">
            <span className="rounded-full border border-neon-cyan/50 bg-neon-cyan/10 px-3 py-1 text-xs text-neon-cyan sm:px-4 sm:py-2 sm:text-sm">
              React
            </span>
            <span className="rounded-full border border-neon-magenta/50 bg-neon-magenta/10 px-3 py-1 text-xs text-neon-magenta sm:px-4 sm:py-2 sm:text-sm">
              Three.js
            </span>
            <span className="rounded-full border border-neon-blue/50 bg-neon-blue/10 px-3 py-1 text-xs text-neon-blue sm:px-4 sm:py-2 sm:text-sm">
              WebGL
            </span>
          </div>
          <div className="mt-4 sm:mt-6">
            <a
              href="https://guns.lol/harshuu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-neon-cyan bg-neon-cyan/10 px-6 py-2 text-sm text-neon-cyan transition-all hover:bg-neon-cyan/30 hover:shadow-[0_0_15px_#00f5ff]"
            >
              About ↗
            </a>
          </div>
        </div>
      </Html>
      
      {/* Decorative elements */}
      <mesh position={[-4, 0, -2]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={opacity}
        />
      </mesh>
      
      <mesh position={[4, 1, -1]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  )
}

// Project card in 3D
function ProjectCard3D({ 
  position, 
  title, 
  description, 
  color,
  opacity 
}: { 
  position: [number, number, number]
  title: string
  description: string
  color: string
  opacity: number
}) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
    if (groupRef.current) {
      // Hover: zoom out (scale down = zoom out effect)
      const targetScale = hovered ? 0.85 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      // Floating bob
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.15
    }
  })
  
  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <group
          ref={groupRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <mesh ref={meshRef}>
            <planeGeometry args={[3, 2]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={hovered ? 0.7 : 0.2}
              transparent
              opacity={opacity * 0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Border */}
          <mesh>
            <planeGeometry args={[3.1, 2.1]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={hovered ? 1.5 : 0.8}
              transparent
              opacity={opacity}
              wireframe
              side={THREE.DoubleSide}
            />
          </mesh>
          
          <Html position={[0, 0, 0.1]} center transform distanceFactor={6}>
            <div 
              className="text-center"
              style={{ opacity, width: 'min(200px, 40vw)' }}
            >
              <h3 className="text-base font-bold text-foreground sm:text-xl">{title}</h3>
              <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{description}</p>
            </div>
          </Html>
        </group>
      </Float>
    </group>
  )
}

// Projects section
function ProjectsSection({ scrollProgress, isMobile }: { scrollProgress: number; isMobile: boolean }) {
  const sectionProgress = (scrollProgress - 0.45) * 4
  const visible = sectionProgress > 0 && sectionProgress < 2
  const opacity = visible ? Math.min(1, sectionProgress) * Math.max(0, 2 - sectionProgress) : 0
  
  if (opacity <= 0) return null
  
  const titleSize = isMobile ? 0.4 : 0.6
  
  const projects = [
    { title: "AI Chat Bot", description: "Python chatbot using NLP & ML", color: "#00f5ff", position: [-4, 1, 0] as [number, number, number] },
    { title: "Portfolio 3D", description: "This site — built with Three.js", color: "#ff00ff", position: [0, 1.5, 2] as [number, number, number] },
    { title: "Snake AI", description: "Classic snake game with AI solver", color: "#5555ff", position: [4, 1, 0] as [number, number, number] },
  ]
  
  return (
    <group position={[0, 0, -35]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          fontSize={titleSize}
          position={[0, 4, 0]}
          color="#00f5ff"
          anchorX="center"
          anchorY="middle"
        >
          Projects
          <meshStandardMaterial
            color="#00f5ff"
            emissive="#00f5ff"
            emissiveIntensity={0.8}
            toneMapped={false}
            transparent
            opacity={opacity}
          />
        </Text>
      </Float>
      
      {projects.map((project, i) => (
        <ProjectCard3D
          key={i}
          position={project.position}
          title={project.title}
          description={project.description}
          color={project.color}
          opacity={opacity}
        />
      ))}
    </group>
  )
}

// Tech stack with orbiting icons
function TechStackSection({ scrollProgress, isMobile }: { scrollProgress: number; isMobile: boolean }) {
  const sectionProgress = (scrollProgress - 0.7) * 4
  const visible = sectionProgress > 0 && sectionProgress < 2
  const opacity = visible ? Math.min(1, sectionProgress) * Math.max(0, 2 - sectionProgress) : 0
  const groupRef = useRef<THREE.Group>(null)
  
  const titleSize = isMobile ? 0.4 : 0.6
  const labelSize = isMobile ? 0.15 : 0.25
  
  const techs = [
    { name: "Python", color: "#3776ab" },
    { name: "JavaScript", color: "#f7df1e" },
    { name: "React", color: "#61dafb" },
    { name: "Three.js", color: "#00f5ff" },
    { name: "HTML/CSS", color: "#e34f26" },
    { name: "Git", color: "#ff00ff" },
  ]
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })
  
  if (opacity <= 0) return null
  
  return (
    <group position={[0, 0, -55]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          fontSize={titleSize}
          position={[0, 3, 0]}
          color="#ff00ff"
          anchorX="center"
          anchorY="middle"
        >
          Tech Stack
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={0.8}
            toneMapped={false}
            transparent
            opacity={opacity}
          />
        </Text>
      </Float>
      
      <group ref={groupRef}>
        {techs.map((tech, i) => {
          const angle = (i / techs.length) * Math.PI * 2
          const radius = 4
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          
          return (
            <Float key={tech.name} speed={1 + i * 0.2} rotationIntensity={0.3} floatIntensity={0.3}>
              <group position={[x, 0, z]}>
                <mesh>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial
                    color={tech.color}
                    emissive={tech.color}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={opacity * 0.8}
                    wireframe
                  />
                </mesh>
                <Text
                  fontSize={labelSize}
                  position={[0, -1, 0]}
                  color={tech.color}
                  anchorX="center"
                  anchorY="middle"
                >
                  {tech.name}
                  <meshStandardMaterial
                    color={tech.color}
                    emissive={tech.color}
                    emissiveIntensity={0.6}
                    toneMapped={false}
                    transparent
                    opacity={opacity}
                  />
                </Text>
              </group>
            </Float>
          )
        })}
      </group>
    </group>
  )
}

// Camera controller
function CameraController({ scrollProgress, mousePosition }: { scrollProgress: number; mousePosition: { x: number; y: number } }) {
  const { camera } = useThree()
  
  useFrame(() => {
    // Move camera based on scroll
    camera.position.z = 8 - scrollProgress * 60
    
    // Slight camera movement based on mouse
    camera.position.x = mousePosition.x * 0.5
    camera.position.y = mousePosition.y * 0.3
    
    camera.lookAt(0, 0, camera.position.z - 10)
  })
  
  return null
}

// Main scene
function Scene({ scrollProgress, mousePosition, isMobile }: { scrollProgress: number; mousePosition: { x: number; y: number }; isMobile: boolean }) {
  return (
    <>
      <color attach="background" args={["#050510"]} />
      <fog attach="fog" args={["#050510", 5, 50]} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00f5ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      
      <CameraController scrollProgress={scrollProgress} mousePosition={mousePosition} />
      
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      
      <ParticleField count={800} scrollProgress={scrollProgress} />
      <FloatingShapes mousePosition={mousePosition} scrollProgress={scrollProgress} />
      
      <HeroSection scrollProgress={scrollProgress} visible={scrollProgress < 0.3} isMobile={isMobile} />
      <AboutSection scrollProgress={scrollProgress} isMobile={isMobile} />
      <ProjectsSection scrollProgress={scrollProgress} isMobile={isMobile} />
      <TechStackSection scrollProgress={scrollProgress} isMobile={isMobile} />
      
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.001, 0.001)}
        />
      </EffectComposer>
    </>
  )
}

export default function CyberScene({ scrollProgress }: { scrollProgress: number }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1
    const y = -(e.clientY / window.innerHeight) * 2 + 1
    setMousePosition({ x, y })
  }
  
  return (
    <div 
      className="fixed inset-0 h-screen w-screen"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, isMobile ? 12 : 8], fov: isMobile ? 75 : 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Scene scrollProgress={scrollProgress} mousePosition={mousePosition} isMobile={isMobile} />
      </Canvas>
    </div>
  )
}
