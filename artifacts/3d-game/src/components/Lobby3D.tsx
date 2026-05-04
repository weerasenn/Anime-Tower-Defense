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
// Naruto Six Paths NPC — Summon NPC (full humanoid model)
// ================================================================
function NarutoSixPathsNPC({ playerPos: _playerPos }: { playerPos: React.RefObject<[number, number, number]> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const orbGroupRef = useRef<THREE.Group>(null!);
  const cloakRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = 0.1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.18;
    }
    if (orbGroupRef.current) {
      orbGroupRef.current.rotation.y += 0.008;
    }
    if (cloakRef.current) {
      const pulse = 0.12 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
      (cloakRef.current.material as THREE.MeshStandardMaterial).opacity = pulse;
    }
  });

  return (
    <group position={NPC_SUMMON_POS}>
      <group ref={groupRef}>
        {/* Legs */}
        <mesh position={[-0.18, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.09, 0.64, 8]} />
          <meshStandardMaterial color="#F97316" />
        </mesh>
        <mesh position={[0.18, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.09, 0.64, 8]} />
          <meshStandardMaterial color="#F97316" />
        </mesh>
        {/* Sandals */}
        <mesh position={[-0.18, 0.03, 0.04]}>
          <boxGeometry args={[0.18, 0.06, 0.22]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[0.18, 0.03, 0.04]}>
          <boxGeometry args={[0.18, 0.06, 0.22]} />
          <meshStandardMaterial color="#111827" />
        </mesh>

        {/* Orange jacket torso */}
        <mesh position={[0, 0.88, 0]} castShadow>
          <boxGeometry args={[0.56, 0.72, 0.42]} />
          <meshStandardMaterial color="#F97316" emissive="#FBBF24" emissiveIntensity={0.4} roughness={0.6} />
        </mesh>
        {/* White sage cloak over jacket */}
        <mesh position={[0, 0.88, -0.01]} castShadow>
          <boxGeometry args={[0.66, 0.74, 0.44]} />
          <meshStandardMaterial color="#F1F5F9" emissive="#F59E0B" emissiveIntensity={0.25} transparent opacity={0.75} roughness={0.5} />
        </mesh>
        {/* Cloak tail behind */}
        <mesh position={[0, 0.45, -0.24]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[0.55, 0.6, 0.06]} />
          <meshStandardMaterial color="#F1F5F9" transparent opacity={0.65} />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.46, 0.96, 0]} rotation={[0, 0, Math.PI / 10]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.55, 8]} />
          <meshStandardMaterial color="#F97316" />
        </mesh>
        <mesh position={[0.46, 0.96, 0]} rotation={[0, 0, -Math.PI / 10]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.55, 8]} />
          <meshStandardMaterial color="#F97316" />
        </mesh>

        {/* Head — skin tone */}
        <mesh position={[0, 1.62, 0]} castShadow>
          <sphereGeometry args={[0.3, 14, 14]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.5} />
        </mesh>
        {/* Headband plate */}
        <mesh position={[0, 1.78, 0.25]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.44, 0.12, 0.06]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Headband cloth ties */}
        <mesh position={[-0.26, 1.76, 0.0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.06, 0.28, 0.04]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.26, 1.76, 0.0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.06, 0.28, 0.04]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Whiskers left */}
        <mesh position={[-0.15, 1.61, 0.285]}><boxGeometry args={[0.18, 0.025, 0.02]} /><meshStandardMaterial color="#0f172a" /></mesh>
        <mesh position={[-0.15, 1.54, 0.275]}><boxGeometry args={[0.17, 0.025, 0.02]} /><meshStandardMaterial color="#0f172a" /></mesh>
        <mesh position={[-0.15, 1.47, 0.265]}><boxGeometry args={[0.16, 0.025, 0.02]} /><meshStandardMaterial color="#0f172a" /></mesh>
        {/* Whiskers right */}
        <mesh position={[0.15, 1.61, 0.285]}><boxGeometry args={[0.18, 0.025, 0.02]} /><meshStandardMaterial color="#0f172a" /></mesh>
        <mesh position={[0.15, 1.54, 0.275]}><boxGeometry args={[0.17, 0.025, 0.02]} /><meshStandardMaterial color="#0f172a" /></mesh>
        <mesh position={[0.15, 1.47, 0.265]}><boxGeometry args={[0.16, 0.025, 0.02]} /><meshStandardMaterial color="#0f172a" /></mesh>

        {/* Sage mode eye rings */}
        <mesh position={[-0.11, 1.63, 0.285]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.055, 0.014, 6, 12]} />
          <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={2.5} />
        </mesh>
        <mesh position={[0.11, 1.63, 0.285]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.055, 0.014, 6, 12]} />
          <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={2.5} />
        </mesh>

        {/* Hair — spiky blonde */}
        <mesh position={[0, 2.02, 0.1]} rotation={[0.35, 0, 0]}>
          <coneGeometry args={[0.13, 0.38, 5]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[-0.15, 1.96, 0.06]} rotation={[0.2, -0.35, -0.22]}>
          <coneGeometry args={[0.1, 0.3, 5]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[0.15, 1.96, 0.06]} rotation={[0.2, 0.35, 0.22]}>
          <coneGeometry args={[0.1, 0.3, 5]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[0, 1.96, -0.1]} rotation={[-0.4, 0, 0]}>
          <coneGeometry args={[0.09, 0.28, 5]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.7} />
        </mesh>

        {/* Shakujo staff */}
        <mesh position={[0.62, 0.85, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 2.0, 6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[0.62, 1.88, 0]}>
          <torusGeometry args={[0.2, 0.042, 6, 12]} />
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Staff ornament rings */}
        {[1.6, 1.72, 1.84].map((y, i) => (
          <mesh key={i} position={[0.72, y, 0]}>
            <torusGeometry args={[0.08, 0.022, 6, 10]} />
            <meshStandardMaterial color="#6B7280" metalness={0.8} />
          </mesh>
        ))}

        {/* 9 Truth-Seeker Orbs */}
        <group ref={orbGroupRef} position={[0, 1.4, 0]}>
          {Array.from({ length: 9 }).map((_, i) => {
            const angle = (i / 9) * Math.PI * 2;
            const hy = Math.sin(angle * 1.5) * 0.25;
            return (
              <mesh key={i} position={[Math.cos(angle) * 1.25, hy, Math.sin(angle) * 1.25]}>
                <sphereGeometry args={[0.13, 8, 8]} />
                <meshStandardMaterial color="#111827" emissive="#0f172a" emissiveIntensity={0.8} roughness={0.05} metalness={1.0} />
              </mesh>
            );
          })}
        </group>

        {/* Chakra cloak aura */}
        <mesh ref={cloakRef} position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.75, 0.65, 2.3, 14]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={1.2} transparent opacity={0.13} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[1.35, 12, 12]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.06} />
        </mesh>
      </group>

      {/* Sign above */}
      <mesh position={[0, 4.3, 0]}>
        <boxGeometry args={[2.4, 0.68, 0.09]} />
        <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={2.2} />
      </mesh>
      {/* Ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.9, 28]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ================================================================
// Itachi Uchiha NPC — Evolution Dojo (East side)
// ================================================================
function EvolutionNPC() {
  const groupRef = useRef<THREE.Group>(null!);
  const crowGroupRef = useRef<THREE.Group>(null!);
  const leftEyeRef = useRef<THREE.Mesh>(null!);
  const rightEyeRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.0 + 1) * 0.14;
    }
    if (crowGroupRef.current) {
      crowGroupRef.current.rotation.y += 0.014;
    }
    if (leftEyeRef.current && rightEyeRef.current) {
      const pulse = 1.5 + Math.abs(Math.sin(state.clock.elapsedTime * 2.5)) * 2.5;
      (leftEyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
      (rightEyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
  });

  return (
    <group position={NPC_EVOLUTION_POS}>
      <group ref={groupRef}>
        {/* Legs — dark */}
        <mesh position={[-0.15, 0.33, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.66, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.15, 0.33, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.66, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Akatsuki cloak body */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.48, 0.52, 1.1, 10]} />
          <meshStandardMaterial color="#0f172a" roughness={0.85} />
        </mesh>
        {/* Red cloud patches on cloak */}
        {[0, 1, 2, 3].map(i => {
          const angle = (i / 4) * Math.PI * 2 + 0.4;
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.47, 0.75 + (i % 2) * 0.22, Math.sin(angle) * 0.47]}>
              <sphereGeometry args={[0.08, 6, 6]} />
              <meshStandardMaterial color="#DC2626" emissive="#DC2626" emissiveIntensity={1.2} />
            </mesh>
          );
        })}

        {/* Cloak — white collar band */}
        <mesh position={[0, 1.38, 0]}>
          <cylinderGeometry args={[0.35, 0.48, 0.12, 10]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
        </mesh>

        {/* Arms hidden in wide sleeves */}
        <mesh position={[-0.52, 0.95, 0]} rotation={[0, 0, Math.PI / 8]} castShadow>
          <cylinderGeometry args={[0.1, 0.09, 0.62, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.85} />
        </mesh>
        <mesh position={[0.52, 0.95, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
          <cylinderGeometry args={[0.1, 0.09, 0.62, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.85} />
        </mesh>

        {/* Head — pale skin */}
        <mesh position={[0, 1.65, 0]} castShadow>
          <sphereGeometry args={[0.28, 14, 14]} />
          <meshStandardMaterial color="#D4A574" roughness={0.5} />
        </mesh>

        {/* Long dark hair swept back */}
        <mesh position={[0, 1.7, -0.22]} rotation={[-0.25, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.06, 0.65, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh position={[-0.12, 1.6, -0.3]} rotation={[-0.15, 0.25, 0.1]}>
          <cylinderGeometry args={[0.06, 0.03, 0.52, 6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh position={[0.12, 1.6, -0.3]} rotation={[-0.15, -0.25, -0.1]}>
          <cylinderGeometry args={[0.06, 0.03, 0.52, 6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Forehead protector — scratched */}
        <mesh position={[0, 1.78, 0.24]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[0.38, 0.11, 0.06]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Scratch mark on forehead protector */}
        <mesh position={[0, 1.78, 0.27]}>
          <boxGeometry args={[0.22, 0.02, 0.01]} />
          <meshStandardMaterial color="#111827" />
        </mesh>

        {/* Sharingan eyes — glowing red */}
        <mesh ref={leftEyeRef} position={[-0.1, 1.66, 0.265]}>
          <sphereGeometry args={[0.048, 8, 8]} />
          <meshStandardMaterial color="#DC2626" emissive="#DC2626" emissiveIntensity={3.0} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.1, 1.66, 0.265]}>
          <sphereGeometry args={[0.048, 8, 8]} />
          <meshStandardMaterial color="#DC2626" emissive="#DC2626" emissiveIntensity={3.0} />
        </mesh>
        {/* Sharingan tomoe rings */}
        <mesh position={[-0.1, 1.66, 0.275]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.05, 0.01, 6, 10]} />
          <meshStandardMaterial color="#7f1d1d" emissive="#EF4444" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0.1, 1.66, 0.275]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.05, 0.01, 6, 10]} />
          <meshStandardMaterial color="#7f1d1d" emissive="#EF4444" emissiveIntensity={1.5} />
        </mesh>

        {/* Crows orbiting */}
        <group ref={crowGroupRef} position={[0, 1.9, 0]}>
          {[0, 1, 2, 3, 4].map(i => {
            const angle = (i / 5) * Math.PI * 2;
            const hy = Math.sin(i * 1.3) * 0.35;
            return (
              <mesh key={i} position={[Math.cos(angle) * 1.6, hy, Math.sin(angle) * 1.6]}
                rotation={[0, -angle, 0.3]}>
                <tetrahedronGeometry args={[0.1]} />
                <meshStandardMaterial color="#0f172a" emissive="#4C1D95" emissiveIntensity={1.0} />
              </mesh>
            );
          })}
        </group>

        {/* Dark aura */}
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.85, 10, 10]} />
          <meshBasicMaterial color="#1e293b" transparent opacity={0.18} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[1.1, 10, 10]} />
          <meshBasicMaterial color="#7f1d1d" transparent opacity={0.06} />
        </mesh>
      </group>

      {/* Platform */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.2, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Gold evolution ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.21, 0]}>
        <ringGeometry args={[0.88, 1.08, 24]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.55} />
      </mesh>
      {/* Sign */}
      <mesh position={[0, 3.6, 0]}>
        <boxGeometry args={[2.5, 0.65, 0.09]} />
        <meshStandardMaterial color="#D97706" emissive="#D97706" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

// ================================================================
// Aizen Sosuke NPC — Raid Tower (West side)
// ================================================================
function RaidNPC() {
  const groupRef = useRef<THREE.Group>(null!);
  const pressureRef = useRef<THREE.Mesh>(null!);
  const bladeRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8 + 2) * 0.1;
    }
    if (pressureRef.current) {
      const t = state.clock.elapsedTime;
      pressureRef.current.scale.setScalar(0.9 + Math.sin(t * 1.8) * 0.18);
      (pressureRef.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + Math.sin(t * 2.2) * 0.06;
    }
    if (bladeRef.current) {
      const shine = 0.5 + Math.abs(Math.sin(state.clock.elapsedTime * 1.5)) * 1.2;
      (bladeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = shine;
    }
  });

  return (
    <group position={NPC_RAID_POS}>
      <group ref={groupRef}>
        {/* Legs */}
        <mesh position={[-0.15, 0.33, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.66, 8]} />
          <meshStandardMaterial color="#1e3a5f" />
        </mesh>
        <mesh position={[0.15, 0.33, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.66, 8]} />
          <meshStandardMaterial color="#1e3a5f" />
        </mesh>

        {/* Shinigami uniform */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.44, 0.49, 1.12, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* White captain haori over uniform */}
        <mesh position={[0, 0.9, -0.01]} castShadow>
          <cylinderGeometry args={[0.56, 0.6, 1.14, 10]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} transparent opacity={0.92} />
        </mesh>
        {/* Haori wide shoulder pads */}
        <mesh position={[-0.54, 1.25, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.22, 0.14, 0.42]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        <mesh position={[0.54, 1.25, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.22, 0.14, 0.42]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.56, 1.0, 0]} rotation={[0, 0, Math.PI / 7]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.62, 8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>
        <mesh position={[0.56, 1.0, 0]} rotation={[0, 0, -Math.PI / 7]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.62, 8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.64, 0]} castShadow>
          <sphereGeometry args={[0.29, 14, 14]} />
          <meshStandardMaterial color="#D4A574" roughness={0.5} />
        </mesh>

        {/* Swept-back brown hair */}
        <mesh position={[0, 1.8, -0.08]} rotation={[-0.45, 0, 0]}>
          <boxGeometry args={[0.38, 0.22, 0.42]} />
          <meshStandardMaterial color="#92400e" roughness={0.75} />
        </mesh>
        <mesh position={[-0.17, 1.74, -0.22]} rotation={[-0.3, 0.25, 0.1]}>
          <cylinderGeometry args={[0.07, 0.04, 0.32, 6]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0.17, 1.74, -0.22]} rotation={[-0.3, -0.25, -0.1]}>
          <cylinderGeometry args={[0.07, 0.04, 0.32, 6]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>

        {/* Glasses — left lens */}
        <mesh position={[-0.1, 1.65, 0.275]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.056, 0.012, 6, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} emissive="#60a5fa" emissiveIntensity={0.6} />
        </mesh>
        {/* Glasses — right lens */}
        <mesh position={[0.1, 1.65, 0.275]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.056, 0.012, 6, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} emissive="#60a5fa" emissiveIntensity={0.6} />
        </mesh>
        {/* Glasses — bridge */}
        <mesh position={[0, 1.65, 0.276]}>
          <boxGeometry args={[0.09, 0.013, 0.013]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>

        {/* Eyes — cold grey */}
        <mesh position={[-0.1, 1.65, 0.27]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial color="#475569" emissive="#60a5fa" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.1, 1.65, 0.27]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial color="#475569" emissive="#60a5fa" emissiveIntensity={0.8} />
        </mesh>

        {/* Kyōka Suigetsu — shimmering blade */}
        <mesh ref={bladeRef} position={[0.5, 0.75, 0.15]} rotation={[0.1, 0.1, -Math.PI / 7]}>
          <boxGeometry args={[0.046, 1.0, 0.03]} />
          <meshStandardMaterial color="#cbd5e1" metalness={1.0} roughness={0.08} emissive="#60a5fa" emissiveIntensity={0.8} />
        </mesh>
        {/* Blade guard */}
        <mesh position={[0.5, 0.32, 0.15]} rotation={[0.1, 0.1, -Math.PI / 7]}>
          <boxGeometry args={[0.12, 0.04, 0.06]} />
          <meshStandardMaterial color="#374151" metalness={0.9} />
        </mesh>

        {/* Spiritual pressure ring — pulses */}
        <mesh ref={pressureRef} position={[0, 1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.65, 0.82, 28]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.14} />
        </mesh>
        <mesh position={[0, 1.0, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
          <ringGeometry args={[1.0, 1.12, 28]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.07} />
        </mesh>

        {/* Reiryoku aura */}
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[1.0, 12, 12]} />
          <meshBasicMaterial color="#1e3a5f" transparent opacity={0.12} />
        </mesh>
      </group>

      {/* Platform */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.2, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Red raid ground ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.21, 0]}>
        <ringGeometry args={[0.88, 1.08, 24]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={0.55} />
      </mesh>
      {/* Sign */}
      <mesh position={[0, 3.6, 0]}>
        <boxGeometry args={[2.5, 0.65, 0.09]} />
        <meshStandardMaterial color="#DC2626" emissive="#DC2626" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

// ================================================================
// LeBron James Player Character — tall, Lakers colors, walking anim
// ================================================================
function PlayerMesh({ playerRef }: { playerRef: React.RefObject<THREE.Group> }) {
  const leftLegRef = useRef<THREE.Group>(null!);
  const rightLegRef = useRef<THREE.Group>(null!);
  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);
  const prevPos = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!playerRef.current) return;
    const pp = playerRef.current.position;
    const dx = pp.x - prevPos.current.x;
    const dz = pp.z - prevPos.current.z;
    const moving = Math.abs(dx) > 0.001 || Math.abs(dz) > 0.001;
    prevPos.current.copy(pp);

    const t = state.clock.elapsedTime * 7;
    const swing = moving ? Math.sin(t) * 0.45 : 0;
    const armSwing = moving ? Math.sin(t) * 0.3 : 0;

    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = armSwing;
  });

  return (
    <group ref={playerRef}>
      {/* Ground shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.46, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </mesh>

      {/* ── Legs ── */}
      <group ref={leftLegRef} position={[-0.19, 0.9, 0]}>
        {/* Thigh — purple shorts */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.12, 0.56, 8]} />
          <meshStandardMaterial color="#552583" roughness={0.7} />
        </mesh>
        {/* Shin — skin */}
        <mesh position={[0, -0.53, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.09, 0.52, 8]} />
          <meshStandardMaterial color="#A07040" roughness={0.6} />
        </mesh>
        {/* Shoe — Lakers gold */}
        <mesh position={[0, -0.86, 0.07]} castShadow>
          <boxGeometry args={[0.22, 0.15, 0.34]} />
          <meshStandardMaterial color="#FDB927" roughness={0.45} metalness={0.2} />
        </mesh>
        <mesh position={[0, -0.94, 0.07]}>
          <boxGeometry args={[0.24, 0.06, 0.35]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.19, 0.9, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.12, 0.56, 8]} />
          <meshStandardMaterial color="#552583" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.53, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.09, 0.52, 8]} />
          <meshStandardMaterial color="#A07040" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.86, 0.07]} castShadow>
          <boxGeometry args={[0.22, 0.15, 0.34]} />
          <meshStandardMaterial color="#FDB927" roughness={0.45} metalness={0.2} />
        </mesh>
        <mesh position={[0, -0.94, 0.07]}>
          <boxGeometry args={[0.24, 0.06, 0.35]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
        </mesh>
      </group>

      {/* Shorts waistband */}
      <mesh position={[0, 1.19, 0]}>
        <boxGeometry args={[0.5, 0.09, 0.32]} />
        <meshStandardMaterial color="#3a1c5e" roughness={0.85} />
      </mesh>

      {/* ── Torso — Lakers purple jersey ── */}
      <mesh position={[0, 1.54, 0]} castShadow>
        <boxGeometry args={[0.56, 0.72, 0.33]} />
        <meshStandardMaterial color="#552583" roughness={0.65} />
      </mesh>
      {/* Jersey number plate gold */}
      <mesh position={[0, 1.57, 0.17]}>
        <boxGeometry args={[0.24, 0.3, 0.01]} />
        <meshStandardMaterial color="#FDB927" emissive="#FDB927" emissiveIntensity={0.3} roughness={0.5} />
      </mesh>

      {/* ── Arms ── */}
      <group ref={leftArmRef} position={[-0.39, 1.74, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.1, 0.09, 0.5, 8]} />
          <meshStandardMaterial color="#A07040" roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.6, 0.04]} castShadow rotation={[0.22, 0, 0.05]}>
          <cylinderGeometry args={[0.09, 0.08, 0.44, 8]} />
          <meshStandardMaterial color="#906035" roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.88, 0.1]} castShadow>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#906035" roughness={0.5} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.39, 1.74, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow rotation={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.1, 0.09, 0.5, 8]} />
          <meshStandardMaterial color="#A07040" roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.6, 0.04]} castShadow rotation={[0.22, 0, -0.05]}>
          <cylinderGeometry args={[0.09, 0.08, 0.44, 8]} />
          <meshStandardMaterial color="#906035" roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.88, 0.1]} castShadow>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#906035" roughness={0.5} />
        </mesh>
      </group>

      {/* ── Neck ── */}
      <mesh position={[0, 1.94, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.18, 8]} />
        <meshStandardMaterial color="#A07040" roughness={0.55} />
      </mesh>

      {/* ── Head — large bald ── */}
      <mesh position={[0, 2.24, 0]} castShadow>
        <sphereGeometry args={[0.3, 14, 14]} />
        <meshStandardMaterial color="#A07040" roughness={0.5} />
      </mesh>
      {/* Shaved hair cap (dark ring on top) */}
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[0.285, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
        <meshStandardMaterial color="#2a1508" roughness={0.96} />
      </mesh>
      {/* Beard */}
      <mesh position={[0, 2.08, 0.22]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.1]} />
        <meshStandardMaterial color="#1a0c02" roughness={0.9} />
      </mesh>
      <mesh position={[-0.15, 2.11, 0.18]} rotation={[0.2, 0.3, 0]}>
        <boxGeometry args={[0.1, 0.18, 0.08]} />
        <meshStandardMaterial color="#1a0c02" roughness={0.9} />
      </mesh>
      <mesh position={[0.15, 2.11, 0.18]} rotation={[0.2, -0.3, 0]}>
        <boxGeometry args={[0.1, 0.18, 0.08]} />
        <meshStandardMaterial color="#1a0c02" roughness={0.9} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 2.26, 0.27]}>
        <sphereGeometry args={[0.042, 6, 6]} />
        <meshStandardMaterial color="#1a0c02" roughness={0.3} />
      </mesh>
      <mesh position={[0.1, 2.26, 0.27]}>
        <sphereGeometry args={[0.042, 6, 6]} />
        <meshStandardMaterial color="#1a0c02" roughness={0.3} />
      </mesh>

      {/* ── Crown glow (LeBron is the King) ── */}
      <mesh position={[0, 2.72, 0]}>
        <sphereGeometry args={[0.09, 6, 6]} />
        <meshStandardMaterial color="#FDB927" emissive="#FDB927" emissiveIntensity={3.5} transparent opacity={0.85} />
      </mesh>
      {/* Name tag glow strip */}
      <mesh position={[0, 2.8, 0]}>
        <boxGeometry args={[0.7, 0.14, 0.01]} />
        <meshStandardMaterial color="#FDB927" emissive="#FDB927" emissiveIntensity={1.8} transparent opacity={0.7} />
      </mesh>

      {/* Direction nub */}
      <mesh position={[0, 1.9, -0.38]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#FDB927" emissive="#FDB927" emissiveIntensity={2.5} />
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
    camTarget.current.set(pp.x, pp.y + 5.5, pp.z + 9);
    lookTarget.current.set(pp.x, pp.y + 0.8, pp.z - 1);
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
      <ambientLight intensity={1.1} color="#d0e0ff" />
      <directionalLight position={[0, 15, 5]} intensity={2.2} color="#ffffff" castShadow />
      <pointLight position={[0, 5, -16]} intensity={7.0} color="#7C3AED" distance={18} />
      <pointLight position={[0, 4, 0]} intensity={4.0} color="#60a5fa" distance={22} />
      <pointLight position={[-8, 4, -2]} intensity={4.5} color="#F59E0B" distance={14} />
      <pointLight position={[8, 4, -2]} intensity={4.5} color="#EF4444" distance={14} />
      <pointLight position={[0, 6, 17]} intensity={3.5} color="#22d3ee" distance={20} />
      <hemisphereLight args={['#4a6fa5', '#1a2a3a', 1.3]} />
      <fog attach="fog" args={['#0d1326', 38, 70]} />
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
