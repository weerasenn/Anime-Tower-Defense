// ============================================================
// LOBBY 3D — Roblox-style walkable 3D lobby
// Vanguard Hall — sci-fi arena with NPCs and portals
// ============================================================

import { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { RARITY_COLORS } from '../data/units';

// ================================================================
// Constants
// ================================================================
const HALL_W = 22;
const HALL_D = 40;
const PLAYER_SPEED = 7;
const INTERACT_RADIUS = 4.5;

// NPC positions
const NPC_SUMMON_POS: [number, number, number] = [0, 0, -16];
const NPC_EVOLUTION_POS: [number, number, number] = [9, 0, -2];
const NPC_RAID_POS: [number, number, number] = [-9, 0, -2];

// ================================================================
// Neon wall panel (left or right side)
// ================================================================
function WallPanel({ side }: { side: 'left' | 'right' }) {
  const sign = side === 'left' ? -1 : 1;
  const x = sign * (HALL_W / 2);

  const strips = [-14, -8, -2, 4, 10, 16];
  return (
    <group>
      {/* Main angled wall */}
      <mesh position={[x + sign * 0.5, 2, 0]} rotation={[0, sign * 0.08, 0]}>
        <boxGeometry args={[1.2, 9, HALL_D + 2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.3} />
      </mesh>

      {/* Inner angled face */}
      <mesh position={[x + sign * -0.6, 2, 0]} rotation={[0, sign * 0.08, 0]}>
        <boxGeometry args={[0.15, 8, HALL_D]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.5} />
      </mesh>

      {/* Neon chevron strips */}
      {strips.map((z, i) => (
        <mesh key={i} position={[x + sign * -0.5, 2.5, z]}>
          <boxGeometry args={[0.08, 0.18, 3.5]} />
          <meshStandardMaterial
            color="#7C3AED"
            emissive="#7C3AED"
            emissiveIntensity={2.5}
          />
        </mesh>
      ))}
      {/* Vertical neon strip along top edge */}
      <mesh position={[x + sign * -0.5, 5.5, 0]}>
        <boxGeometry args={[0.08, 0.12, HALL_D]} />
        <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3.0} />
      </mesh>
      {/* Bottom neon strip */}
      <mesh position={[x + sign * -0.5, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.10, HALL_D]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={2.5} />
      </mesh>

      {/* Ceiling overhang */}
      <mesh position={[x + sign * -2, 6.5, 0]}>
        <boxGeometry args={[4, 0.3, HALL_D + 2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* Ceiling neon under overhang */}
      <mesh position={[x + sign * -2, 6.3, 0]}>
        <boxGeometry args={[3.5, 0.06, HALL_D - 2]} />
        <meshStandardMaterial color="#6D28D9" emissive="#6D28D9" emissiveIntensity={1.5} transparent opacity={0.9} />
      </mesh>

      {/* Diagonal upper panels */}
      <mesh position={[x + sign * -3.5, 5.0, 0]} rotation={[0, 0, sign * -0.35]}>
        <boxGeometry args={[3, 0.2, HALL_D - 4]} />
        <meshStandardMaterial color="#111827" roughness={0.9} metalness={0.4} />
      </mesh>
    </group>
  );
}

// ================================================================
// Floor with glow strips
// ================================================================
function LobbyFloor() {
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[HALL_W, HALL_D]} />
        <meshStandardMaterial color="#0a0f1a" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Central blue glow path going N */}
      {[-16, -12, -8, -4, 0, 4, 8, 12, 16].map((z, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]}>
          <planeGeometry args={[1.2, 3.5]} />
          <meshBasicMaterial color="#1D4ED8" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Grid helper */}
      <gridHelper args={[HALL_W, 22, '#1e293b', '#0f172a']} position={[0, 0.005, 0]} />

      {/* Left-right floor accent strips */}
      {[-1, 1].map((s, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[s * 5.5, 0.01, 0]}>
          <planeGeometry args={[0.12, HALL_D - 2]} />
          <meshBasicMaterial color="#7C3AED" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Stars decorating the floor at intervals */}
      {[-10, -4, 4, 10].map((z, i) => [-4.5, 4.5].map((x, j) => (
        <mesh key={`s${i}${j}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.012, z]}>
          <circleGeometry args={[0.25, 6]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.8} />
        </mesh>
      )))}
    </group>
  );
}

// ================================================================
// Ceiling with neon
// ================================================================
function LobbyCeiling() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 7.5, 0]}>
        <planeGeometry args={[HALL_W + 2, HALL_D + 2]} />
        <meshStandardMaterial color="#060a12" roughness={1} />
      </mesh>
      {/* Ceiling neon center strip */}
      <mesh position={[0, 7.4, 0]}>
        <boxGeometry args={[1.5, 0.08, HALL_D - 4]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={2.0} />
      </mesh>
    </group>
  );
}

// ================================================================
// End wall (North — behind summon)
// ================================================================
function NorthWall() {
  return (
    <group>
      <mesh position={[0, 3.5, -HALL_D / 2 - 0.5]}>
        <boxGeometry args={[HALL_W + 2, 10, 1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* SUMMON text portal frame */}
      <mesh position={[0, 5, -HALL_D / 2 - 0.6]}>
        <boxGeometry args={[5, 3, 0.1]} />
        <meshStandardMaterial color="#1e1b4b" emissive="#4C1D95" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 5, -HALL_D / 2 - 0.7]}>
        <boxGeometry args={[4.8, 2.8, 0.05]} />
        <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={2.0} />
      </mesh>
    </group>
  );
}

// ================================================================
// Decorative plant
// ================================================================
function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.4, 0.35, 0.6, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      {/* Trunk */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.8, 6]} />
        <meshStandardMaterial color="#854d0e" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.7, 8, 8]} />
        <meshStandardMaterial color="#15803d" emissive="#166534" emissiveIntensity={0.4} roughness={0.8} />
      </mesh>
      {/* Glow ring at base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.45, 0.6, 16]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ================================================================
// Summon Temple — raised altar at North end
// ================================================================
function SummonTemple() {
  const orbRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.position.y = 5.2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      orbRef.current.rotation.y += 0.02;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.015;
    }
  });

  return (
    <group position={[0, 0, -17]}>
      {/* Steps leading up */}
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[0, i * 0.3 + 0.15, i * 0.6 + 1.5]}>
          <boxGeometry args={[8 - i * 0.5, 0.3, 1.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Main platform */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[8, 0.6, 5]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Platform neon edges */}
      {[[-3.8, 0], [3.8, 0]].map(([x], i) => (
        <mesh key={i} position={[x, 1.45, 0]}>
          <boxGeometry args={[0.08, 0.08, 5.2]} />
          <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={3.0} />
        </mesh>
      ))}

      {/* Altar pedestal */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[1.0, 1.3, 2.8, 8]} />
        <meshStandardMaterial color="#1e1b4b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Pedestal neon ring */}
      <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.06, 8, 32]} />
        <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={3.0} />
      </mesh>

      {/* Portal orb */}
      <mesh ref={orbRef} position={[0, 5.2, 0]} castShadow>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#4C1D95"
          emissiveIntensity={2.0}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Outer glow orb */}
      <mesh position={[0, 5.2, 0]}>
        <sphereGeometry args={[1.4, 16, 16]} />
        <meshBasicMaterial color="#7C3AED" transparent opacity={0.15} />
      </mesh>

      {/* Spinning ring around orb */}
      <mesh ref={ringRef} position={[0, 5.2, 0]}>
        <torusGeometry args={[1.8, 0.07, 8, 32]} />
        <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={2.5} />
      </mesh>

      {/* SUMMON label above */}
      {/* Represented as a glowing panel */}
      <mesh position={[0, 7.5, 0]}>
        <boxGeometry args={[3.5, 0.8, 0.1]} />
        <meshStandardMaterial color="#1e1b4b" emissive="#6D28D9" emissiveIntensity={2.0} />
      </mesh>
    </group>
  );
}

// ================================================================
// Naruto Six Paths NPC — Summon NPC
// ================================================================
function NarutoSixPathsNPC({ playerPos }: { playerPos: React.RefObject<[number, number, number]> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const orbGroupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 1.2) * 0.25;
    }
    if (orbGroupRef.current) {
      orbGroupRef.current.rotation.y += 0.008;
    }
  });

  const N_ORBS = 9;

  return (
    <group position={NPC_SUMMON_POS}>
      <group ref={groupRef}>
        {/* Body */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 1.4, 10]} />
          <meshStandardMaterial
            color="#F97316"
            emissive="#FBBF24"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 2.0, 0]} castShadow>
          <sphereGeometry args={[0.42, 12, 12]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F97316" emissiveIntensity={0.6} />
        </mesh>

        {/* Chakra cloak (outer aura) */}
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 2.0, 10]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={1.0} transparent opacity={0.25} />
        </mesh>

        {/* Shakujo staff */}
        <mesh position={[0.55, 1.0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.5, 6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        {/* Staff ring */}
        <mesh position={[0.55, 2.3, 0]}>
          <torusGeometry args={[0.22, 0.05, 6, 16]} />
          <meshStandardMaterial color="#374151" metalness={0.9} />
        </mesh>

        {/* 9 Truth-Seeker Orbs floating in ring */}
        <group ref={orbGroupRef} position={[0, 1.5, 0]}>
          {Array.from({ length: N_ORBS }).map((_, i) => {
            const angle = (i / N_ORBS) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(angle) * 1.1, 0, Math.sin(angle) * 1.1]}>
                <sphereGeometry args={[0.14, 8, 8]} />
                <meshStandardMaterial
                  color="#111827"
                  emissive="#111827"
                  emissiveIntensity={0.5}
                  roughness={0.1}
                  metalness={1.0}
                />
              </mesh>
            );
          })}
        </group>

        {/* Aura glow sphere */}
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[1.3, 12, 12]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.1} />
        </mesh>
      </group>

      {/* NPC label sign */}
      <mesh position={[0, 4.0, 0]}>
        <boxGeometry args={[2.0, 0.6, 0.08]} />
        <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={2.0} />
      </mesh>

      {/* Ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.8, 24]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ================================================================
// Evolution Dojo NPC (East side)
// ================================================================
function EvolutionNPC() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime * 1.5 + 1) * 0.2;
      ref.current.rotation.y += 0.01;
    }
  });
  return (
    <group position={NPC_EVOLUTION_POS}>
      <mesh ref={ref} position={[0, 1.2, 0]} castShadow>
        <octahedronGeometry args={[0.8]} />
        <meshStandardMaterial color="#F59E0B" emissive="#D97706" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.3, 24]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.2} />
      </mesh>
      {/* Platform */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.2, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Sign */}
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[2.2, 0.55, 0.08]} />
        <meshStandardMaterial color="#D97706" emissive="#D97706" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

// ================================================================
// Raid Tower NPC (West side)
// ================================================================
function RaidNPC() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime * 1.8 + 2) * 0.18;
      ref.current.rotation.y -= 0.012;
    }
  });
  return (
    <group position={NPC_RAID_POS}>
      <mesh ref={ref} position={[0, 1.2, 0]} castShadow>
        <icosahedronGeometry args={[0.75]} />
        <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.3, 24]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={0.2} />
      </mesh>
      {/* Platform */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.2, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Sign */}
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[2.2, 0.55, 0.08]} />
        <meshStandardMaterial color="#DC2626" emissive="#DC2626" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

// ================================================================
// Player Character
// ================================================================
function PlayerMesh({ playerRef }: { playerRef: React.RefObject<THREE.Group> }) {
  const bodyRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 4) * 0.04;
    }
  });
  return (
    <group ref={playerRef}>
      {/* Shadow on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.4, 12]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 6, 12]} />
        <meshStandardMaterial color="#e2e8f0" emissive="#3B82F6" emissiveIntensity={0.2} roughness={0.3} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color="#fde68a" roughness={0.4} />
      </mesh>
      {/* Direction indicator */}
      <mesh position={[0, 1.75, -0.32]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.18, 4]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

// ================================================================
// Camera controller — 3rd person follow
// ================================================================
function CameraRig({ playerRef }: { playerRef: React.RefObject<THREE.Group> }) {
  const { camera } = useThree();
  const camTarget = useRef(new THREE.Vector3(0, 4, 12));
  const lookTarget = useRef(new THREE.Vector3(0, 1, 0));

  useFrame(() => {
    if (!playerRef.current) return;
    const pp = playerRef.current.position;
    camTarget.current.set(pp.x, pp.y + 7, pp.z + 11);
    lookTarget.current.set(pp.x, pp.y + 1, pp.z);
    camera.position.lerp(camTarget.current, 0.09);
    camera.lookAt(lookTarget.current);
  });
  return null;
}

// ================================================================
// Environment — decorative back pillars etc.
// ================================================================
function EnvDecor() {
  const pillars: [number, number][] = [
    [-9, -14], [9, -14],
    [-9, -6], [9, -6],
    [-9, 2], [9, 2],
    [-9, 10], [9, 10],
    [-9, 17], [9, 17],
  ];
  return (
    <group>
      {pillars.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 2.0, 0]}>
            <cylinderGeometry args={[0.22, 0.28, 5.5, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 5.1, 0]}>
            <boxGeometry args={[0.6, 0.3, 0.6]} />
            <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={1.5} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <circleGeometry args={[0.4, 8]} />
            <meshBasicMaterial color="#7C3AED" transparent opacity={0.3} />
          </mesh>
        </group>
      ))}

      {/* South entry arch */}
      <mesh position={[-3, 3.5, 17]}>
        <boxGeometry args={[0.5, 7, 0.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      <mesh position={[3, 3.5, 17]}>
        <boxGeometry args={[0.5, 7, 0.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      <mesh position={[0, 7.1, 17]}>
        <boxGeometry args={[7, 0.4, 0.5]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={2.0} />
      </mesh>
    </group>
  );
}

// ================================================================
// Lighting
// ================================================================
function LobbyLighting() {
  return (
    <>
      <ambientLight intensity={0.35} color="#1e1b4b" />
      <directionalLight position={[0, 15, 5]} intensity={0.8} color="#ffffff" castShadow />
      <pointLight position={[0, 4, -16]} intensity={4.0} color="#7C3AED" distance={12} />
      <pointLight position={[0, 3, 0]} intensity={2.0} color="#3B82F6" distance={15} />
      <pointLight position={[-8, 3, -2]} intensity={2.5} color="#F59E0B" distance={8} />
      <pointLight position={[8, 3, -2]} intensity={2.5} color="#EF4444" distance={8} />
      <pointLight position={[0, 5, 17]} intensity={1.5} color="#22d3ee" distance={12} />
      <hemisphereLight args={['#1e293b', '#0a0f1a', 0.6]} />
      <fog attach="fog" args={['#050510', 30, 55]} />
    </>
  );
}

// ================================================================
// Game tick for proximity detection (runs in canvas)
// ================================================================
interface NearNPC { type: 'summon' | 'evolution' | 'raid' | null }

function ProximityDetector({
  playerRef,
  onNearNPC,
}: {
  playerRef: React.RefObject<THREE.Group>;
  onNearNPC: (n: NearNPC) => void;
}) {
  const lastNear = useRef<string | null>(null);

  useFrame(() => {
    if (!playerRef.current) return;
    const pp = playerRef.current.position;

    const distSummon = Math.sqrt((pp.x - NPC_SUMMON_POS[0]) ** 2 + (pp.z - NPC_SUMMON_POS[2]) ** 2);
    const distEvo = Math.sqrt((pp.x - NPC_EVOLUTION_POS[0]) ** 2 + (pp.z - NPC_EVOLUTION_POS[2]) ** 2);
    const distRaid = Math.sqrt((pp.x - NPC_RAID_POS[0]) ** 2 + (pp.z - NPC_RAID_POS[2]) ** 2);

    let near: string | null = null;
    if (distSummon < INTERACT_RADIUS) near = 'summon';
    else if (distEvo < INTERACT_RADIUS) near = 'evolution';
    else if (distRaid < INTERACT_RADIUS) near = 'raid';

    if (near !== lastNear.current) {
      lastNear.current = near;
      onNearNPC({ type: near as NearNPC['type'] });
    }
  });
  return null;
}

// ================================================================
// Virtual Joystick (HTML overlay)
// ================================================================
interface JoystickOutput { x: number; y: number }

function VirtualJoystick({ onChange }: { onChange: (v: JoystickOutput) => void }) {
  const baseRef = useRef<HTMLDivElement>(null!);
  const stickRef = useRef<HTMLDivElement>(null!);
  const activeTouch = useRef<number | null>(null);
  const baseCenter = useRef({ x: 0, y: 0 });
  const RADIUS = 50;

  function updateStick(cx: number, cy: number) {
    const dx = cx - baseCenter.current.x;
    const dy = cy - baseCenter.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clamp = Math.min(dist, RADIUS);
    const angle = Math.atan2(dy, dx);
    const sx = Math.cos(angle) * clamp;
    const sy = Math.sin(angle) * clamp;
    if (stickRef.current) {
      stickRef.current.style.transform = `translate(calc(-50% + ${sx}px), calc(-50% + ${sy}px))`;
    }
    const norm = Math.min(dist / RADIUS, 1);
    onChange({ x: Math.cos(angle) * norm, y: Math.sin(angle) * norm });
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (activeTouch.current !== null) return;
    const t = e.changedTouches[0];
    activeTouch.current = t.identifier;
    const r = baseRef.current.getBoundingClientRect();
    baseCenter.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    updateStick(t.clientX, t.clientY);
  }
  function handleTouchMove(e: React.TouchEvent) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouch.current) {
        updateStick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
      }
    }
  }
  function handleTouchEnd(e: React.TouchEvent) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouch.current) {
        activeTouch.current = null;
        if (stickRef.current) stickRef.current.style.transform = 'translate(-50%, -50%)';
        onChange({ x: 0, y: 0 });
      }
    }
  }

  return (
    <div
      ref={baseRef}
      className="joystick-base"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div ref={stickRef} className="joystick-stick" />
    </div>
  );
}

// ================================================================
// Main 3D Scene component (inside Canvas)
// ================================================================
function LobbyScene({
  playerRef,
  joystickRef,
  keysRef,
  onNearNPC,
}: {
  playerRef: React.RefObject<THREE.Group>;
  joystickRef: React.RefObject<JoystickOutput>;
  keysRef: React.RefObject<Set<string>>;
  onNearNPC: (n: NearNPC) => void;
}) {
  const prevTime = useRef(Date.now());

  useFrame(() => {
    if (!playerRef.current) return;
    const now = Date.now();
    const dt = Math.min((now - prevTime.current) / 1000, 0.1);
    prevTime.current = now;

    const keys = keysRef.current;
    const joy = joystickRef.current;

    let dx = 0;
    let dz = 0;

    // Keyboard
    if (keys.has('KeyW') || keys.has('ArrowUp')) dz -= 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) dz += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) dx -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) dx += 1;

    // Joystick
    if (joy.x !== 0 || joy.y !== 0) {
      dx += joy.x;
      dz += joy.y;
    }

    // Normalize diagonal
    const mag = Math.sqrt(dx * dx + dz * dz);
    if (mag > 0) {
      dx /= mag;
      dz /= mag;
    }

    const speed = PLAYER_SPEED * dt;
    const pp = playerRef.current.position;
    const nx = Math.max(-HALL_W / 2 + 1, Math.min(HALL_W / 2 - 1, pp.x + dx * speed));
    const nz = Math.max(-HALL_D / 2 + 1, Math.min(HALL_D / 2 - 1, pp.z + dz * speed));

    playerRef.current.position.set(nx, 0, nz);

    // Face direction of movement
    if (mag > 0.01) {
      const angle = Math.atan2(dx, dz);
      playerRef.current.rotation.y = angle;
    }
  });

  return (
    <>
      <LobbyLighting />
      <LobbyFloor />
      <LobbyCeiling />
      <WallPanel side="left" />
      <WallPanel side="right" />
      <NorthWall />
      <EnvDecor />
      <SummonTemple />
      <NarutoSixPathsNPC playerPos={playerRef as any} />
      <EvolutionNPC />
      <RaidNPC />

      {/* Plants */}
      <Plant position={[-7.5, 0, -10]} />
      <Plant position={[7.5, 0, -10]} />
      <Plant position={[-7.5, 0, 8]} />
      <Plant position={[7.5, 0, 8]} />
      <Plant position={[-7.5, 0, -4]} />
      <Plant position={[7.5, 0, -4]} />

      <PlayerMesh playerRef={playerRef} />
      <CameraRig playerRef={playerRef} />
      <ProximityDetector playerRef={playerRef} onNearNPC={onNearNPC} />
    </>
  );
}

// ================================================================
// NPC Interact Prompt (HTML overlay)
// ================================================================
function InteractPrompt({
  nearNPC,
  onInteract,
}: {
  nearNPC: NearNPC;
  onInteract: () => void;
}) {
  if (!nearNPC.type) return null;

  const labels: Record<string, { icon: string; name: string; color: string }> = {
    summon: { icon: '🌀', name: 'SUMMON PORTAL', color: '#7C3AED' },
    evolution: { icon: '⚡', name: 'EVOLUTION DOJO', color: '#D97706' },
    raid: { icon: '⚔️', name: 'RAID TOWER', color: '#DC2626' },
  };

  const info = labels[nearNPC.type];

  return (
    <div className="interact-prompt">
      <div className="interact-icon">{info.icon}</div>
      <div className="interact-name" style={{ color: info.color }}>{info.name}</div>
      <button className="interact-btn" style={{ borderColor: info.color, color: info.color }} onClick={onInteract}>
        <span className="interact-key">E</span> Interact
      </button>
    </div>
  );
}

// ================================================================
// Lobby HUD (player stats overlay)
// ================================================================
function LobbyHUD() {
  const { profile, ownedUnits, equippedUnitIds, setScreen } = useGameStore();
  const equippedCount = equippedUnitIds.filter(Boolean).length;

  return (
    <div className="lobby3d-hud">
      <div className="lobby3d-hud-inner">
        <div className="lobby3d-profile">
          <div className="lobby3d-avatar">⚔️</div>
          <div>
            <div className="lobby3d-name">{profile.name}</div>
            <div className="lobby3d-level">LVL {profile.level}</div>
          </div>
        </div>
        <div className="lobby3d-currencies">
          <div className="lobby3d-currency coins">🪙 {profile.coins.toLocaleString()}</div>
          <div className="lobby3d-currency gems">💎 {profile.gems.toLocaleString()}</div>
        </div>
        <div className="lobby3d-squad">
          Squad: <span style={{ color: '#3B82F6' }}>{equippedCount}/5</span>
        </div>
        <div className="lobby3d-nav-btns">
          <button className="lobby3d-nav-btn" onClick={() => setScreen('inventory')}>📦 Units</button>
          <button className="lobby3d-nav-btn" onClick={() => setScreen('shop')}>🏪 Shop</button>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// Controls hint
// ================================================================
function ControlsHint({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="controls-hint">
      {isMobile ? '🕹️ Joystick to move • Walk near NPCs to interact' : 'WASD / Arrow Keys to move • Walk near NPCs • Press E to interact'}
    </div>
  );
}

// ================================================================
// Main Lobby3D export
// ================================================================
export default function Lobby3D() {
  const { setScreen } = useGameStore();
  const playerRef = useRef<THREE.Group>(null!);
  const joystickRef = useRef<JoystickOutput>({ x: 0, y: 0 });
  const keysRef = useRef<Set<string>>(new Set());
  const [nearNPC, setNearNPC] = useState<NearNPC>({ type: null });
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // Keyboard events
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (e.code === 'KeyE' && nearNPC.type) handleInteract();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [nearNPC.type]);

  const handleInteract = useCallback(() => {
    if (!nearNPC.type) return;
    if (nearNPC.type === 'summon') setScreen('summon');
    else if (nearNPC.type === 'evolution') setScreen('inventory');
    else if (nearNPC.type === 'raid') setScreen('modes');
  }, [nearNPC.type, setScreen]);

  const handleNearNPC = useCallback((n: NearNPC) => setNearNPC(n), []);

  const handleJoystick = useCallback((v: JoystickOutput) => {
    joystickRef.current = v;
  }, []);

  return (
    <div className="lobby3d-root">
      <Canvas
        shadows
        camera={{ position: [0, 7, 14], fov: 60 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <LobbyScene
          playerRef={playerRef}
          joystickRef={joystickRef}
          keysRef={keysRef}
          onNearNPC={handleNearNPC}
        />
      </Canvas>

      {/* HTML Overlays */}
      <LobbyHUD />
      <InteractPrompt nearNPC={nearNPC} onInteract={handleInteract} />
      <ControlsHint isMobile={isMobile} />

      {/* Mobile joystick */}
      {isMobile && (
        <VirtualJoystick onChange={handleJoystick} />
      )}
    </div>
  );
}
