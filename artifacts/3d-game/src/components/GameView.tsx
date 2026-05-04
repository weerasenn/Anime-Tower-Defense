// ============================================================
// GAME VIEW — 3D React Three Fiber game scene
// ============================================================

import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore, PATH_WAYPOINTS, getPositionOnPath, isOnPath } from '../store/gameStore';
import { UNITS, BOSSES } from '../data/units';
import { ENEMIES } from '../data/enemies';
import GameUI from './GameUI';

// ---- Constants ----
const GRID_SIZE = 10;
const HALF = GRID_SIZE / 2;

// ============================================================
// Path terrain tiles
// ============================================================
function PathTile({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, -0.05, z]} receiveShadow>
      <boxGeometry args={[0.9, 0.08, 0.9]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
    </mesh>
  );
}

// ============================================================
// Grid floor with path highlighting
// ============================================================
function GameFloor({ onCellClick, selectedUnitId }: { onCellClick: (x: number, z: number) => void; selectedUnitId: string | null }) {
  const pathCells = useMemo(() => {
    const cells: [number, number][] = [];
    for (let gx = -HALF; gx < HALF; gx++) {
      for (let gz = -HALF; gz < HALF; gz++) {
        if (isOnPath(gx + 0.5, gz + 0.5)) cells.push([gx + 0.5, gz + 0.5]);
      }
    }
    return cells;
  }, []);

  const pathSet = useMemo(() => new Set(pathCells.map(([x, z]) => `${x},${z}`)), [pathCells]);

  return (
    <group>
      {/* Base ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[GRID_SIZE + 2, GRID_SIZE + 2]} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.95} />
      </mesh>

      {/* Grid cells */}
      {Array.from({ length: GRID_SIZE }, (_, gi) =>
        Array.from({ length: GRID_SIZE }, (_, gj) => {
          const cx = gi - HALF + 0.5;
          const cz = gj - HALF + 0.5;
          const onPath = pathSet.has(`${cx},${cz}`);
          const canPlace = !onPath && selectedUnitId;
          return (
            <mesh
              key={`${gi}-${gj}`}
              position={[cx, 0, cz]}
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={canPlace ? (e) => { e.stopPropagation(); onCellClick(cx, cz); } : undefined}
            >
              <planeGeometry args={[0.95, 0.95]} />
              <meshStandardMaterial
                color={onPath ? '#16213e' : (canPlace ? '#1a2a1a' : '#111122')}
                roughness={0.9}
                transparent
                opacity={onPath ? 0.8 : 0.6}
              />
            </mesh>
          );
        })
      )}

      {/* Path tiles */}
      {pathCells.map(([x, z]) => (
        <PathTile key={`pt-${x}-${z}`} x={x} z={z} />
      ))}

      {/* Grid lines */}
      <gridHelper args={[GRID_SIZE, GRID_SIZE, '#1e293b', '#0f172a']} position={[0, 0.01, 0]} />

      {/* Path direction arrows */}
      {PATH_WAYPOINTS.slice(0, -1).map(([x, z], i) => {
        const [nx, nz] = PATH_WAYPOINTS[i + 1];
        const mx = (x + nx) / 2;
        const mz = (z + nz) / 2;
        const angle = Math.atan2(nz - z, nx - x);
        return (
          <mesh key={`arrow-${i}`} position={[mx, 0.05, mz]} rotation={[-Math.PI / 2, 0, -angle]}>
            <coneGeometry args={[0.15, 0.3, 4]} />
            <meshStandardMaterial color="#334155" opacity={0.5} transparent />
          </mesh>
        );
      })}

      {/* Start marker */}
      <mesh position={[PATH_WAYPOINTS[0][0], 0.15, PATH_WAYPOINTS[0][1]]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#4ADE80" emissive="#4ADE80" emissiveIntensity={0.8} />
      </mesh>

      {/* End marker */}
      <mesh position={[PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1][0], 0.15, PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1][1]]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// ============================================================
// Enemy unit in 3D
// ============================================================
function EnemyMesh({ enemyId, progress, hp, maxHp, isBoss, bossPhase, size, color, auraColor, slowFactor }: {
  enemyId: string; progress: number; hp: number; maxHp: number;
  isBoss?: boolean; bossPhase?: 1 | 2; size: number; color: string; auraColor: string; slowFactor?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const [pos] = useState<[number, number]>([0, 0]);

  useFrame((_, delta) => {
    const [wx, wz] = getPositionOnPath(progress);

    if (meshRef.current) {
      meshRef.current.position.set(wx, size * 0.5 + (isBoss ? 0.2 : 0), wz);
      meshRef.current.rotation.y += delta * (isBoss ? 0.5 : 1.5);
    }
    if (glowRef.current) {
      glowRef.current.position.set(wx, size * 0.5 + (isBoss ? 0.2 : 0), wz);
      const t = Date.now() / 1000;
      const scale = 1 + Math.sin(t * 3) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  const hpPct = hp / maxHp;
  const hpColor = hpPct > 0.6 ? '#4ADE80' : hpPct > 0.3 ? '#F59E0B' : '#EF4444';
  const isFrozen = (slowFactor || 0) > 0;

  const geomSize = size * (isBoss ? 1.2 : 0.8);

  return (
    <group>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[geomSize * 0.7, 8, 8]} />
        <meshStandardMaterial
          color={isFrozen ? '#7DD3FC' : color}
          emissive={isFrozen ? '#7DD3FC' : auraColor}
          emissiveIntensity={isBoss ? (bossPhase === 2 ? 2.0 : 1.5) : 1.0}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Body */}
      <mesh ref={meshRef} castShadow>
        {isBoss
          ? <boxGeometry args={[geomSize, geomSize, geomSize]} />
          : <boxGeometry args={[geomSize * 0.8, geomSize, geomSize * 0.8]} />
        }
        <meshStandardMaterial
          color={isFrozen ? '#BAE6FD' : color}
          emissive={isFrozen ? '#60A5FA' : auraColor}
          emissiveIntensity={isBoss ? (bossPhase === 2 ? 1.5 : 0.8) : 0.5}
          roughness={0.3}
          metalness={isBoss ? 0.8 : 0.2}
        />
      </mesh>

      {/* Boss crown */}
      {isBoss && (
        <group>
          <mesh position={[0, geomSize * 0.5 + 0.3, 0]}>
            <coneGeometry args={[geomSize * 0.3, 0.5, 6]} />
            <meshStandardMaterial color={auraColor} emissive={auraColor} emissiveIntensity={1.5} />
          </mesh>
          {/* Phase 2 extra spikes */}
          {bossPhase === 2 && [0, 1, 2, 3].map(i => (
            <mesh key={i} position={[
              Math.cos(i * Math.PI / 2) * geomSize * 0.6,
              geomSize * 0.3,
              Math.sin(i * Math.PI / 2) * geomSize * 0.6,
            ]}>
              <coneGeometry args={[0.1, 0.4, 4]} />
              <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={2} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// ============================================================
// Character-specific chibi body for tower units
// Each character gets a distinctive 3-part (legs+body+head) shape
// plus their signature accessory
// ============================================================
function CharacterBody({ unitId, color, auraColor }: { unitId: string; color: string; auraColor: string }) {
  const mat = (c: string, emit?: string, ei = 0.4) => (
    <meshStandardMaterial color={c} emissive={emit ?? c} emissiveIntensity={ei} roughness={0.4} />
  );

  // Shared: legs + arms builder
  const Legs = ({ legColor }: { legColor: string }) => (
    <>
      <mesh position={[-0.1, -0.12, 0]}>
        <cylinderGeometry args={[0.055, 0.05, 0.22, 6]} />
        {mat(legColor)}
      </mesh>
      <mesh position={[0.1, -0.12, 0]}>
        <cylinderGeometry args={[0.055, 0.05, 0.22, 6]} />
        {mat(legColor)}
      </mesh>
    </>
  );

  const Head = ({ hc, emit, ei = 0.2 }: { hc: string; emit?: string; ei?: number }) => (
    <mesh position={[0, 0.38, 0]}>
      <sphereGeometry args={[0.18, 10, 10]} />
      {mat(hc, emit ?? hc, ei)}
    </mesh>
  );

  const Body = ({ bc, emit, ei = 0.5, shape = 'cyl' }: { bc: string; emit?: string; ei?: number; shape?: string }) => (
    <mesh position={[0, 0.12, 0]}>
      {shape === 'box' ? <boxGeometry args={[0.32, 0.38, 0.28]} /> : <cylinderGeometry args={[0.18, 0.19, 0.38, 10]} />}
      {mat(bc, emit ?? bc, ei)}
    </mesh>
  );

  // Naruto — orange jumpsuit, blonde spiky hair, whiskers
  if (unitId.startsWith('orange-outcast')) return (
    <group>
      <Legs legColor={color} />
      <Body bc={color} emit={auraColor} />
      <Head hc="#FBBF24" />
      {/* Spiky yellow hair */}
      <mesh position={[0, 0.58, 0.05]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.08, 0.2, 5]} />
        {mat('#FBBF24', '#F59E0B', 0.8)}
      </mesh>
      <mesh position={[-0.09, 0.54, 0]} rotation={[0.15, -0.4, -0.25]}>
        <coneGeometry args={[0.06, 0.16, 5]} />
        {mat('#FBBF24', '#F59E0B', 0.8)}
      </mesh>
      {/* Whisker lines */}
      <mesh position={[-0.09, 0.38, 0.17]}><boxGeometry args={[0.1, 0.013, 0.01]} />{mat('#0f172a', '#0f172a', 0)}</mesh>
      <mesh position={[0.09, 0.38, 0.17]}><boxGeometry args={[0.1, 0.013, 0.01]} />{mat('#0f172a', '#0f172a', 0)}</mesh>
    </group>
  );

  // Tanjiro — dark green jacket, scar on forehead, hanafuda earring
  if (unitId.startsWith('green-trainee')) return (
    <group>
      <Legs legColor="#1e3a2a" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#D4A574" />
      {/* Dark hair */}
      <mesh position={[0, 0.52, -0.06]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.26, 0.14, 0.22]} />
        {mat('#1e293b', '#1e293b', 0.1)}
      </mesh>
      {/* Scar */}
      <mesh position={[-0.05, 0.42, 0.17]}><boxGeometry args={[0.07, 0.025, 0.01]} />{mat('#DC2626', '#EF4444', 1.5)}</mesh>
      {/* Hanafuda earring — small red circle */}
      <mesh position={[-0.19, 0.36, 0.08]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.05, 0.015, 6, 10]} />
        {mat('#DC2626', '#EF4444', 1.5)}
      </mesh>
      {/* Breathing water ring */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.018, 6, 20]} />
        {mat('#60A5FA', '#3B82F6', 2.0)}
      </mesh>
    </group>
  );

  // Luffy — red vest, straw hat, grin
  if (unitId.startsWith('rubber-captain')) return (
    <group>
      <Legs legColor="#1e3a5f" />
      <Body bc={color} emit={auraColor} shape="box" />
      <Head hc="#D4A574" />
      {/* Straw hat brim */}
      <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.02, 12]} />
        {mat('#D97706', '#B45309', 0.3)}
      </mesh>
      {/* Straw hat top */}
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.15, 0.18, 10]} />
        {mat('#D97706', '#B45309', 0.3)}
      </mesh>
      {/* Red hat band */}
      <mesh position={[0, 0.515, 0]}>
        <torusGeometry args={[0.19, 0.03, 6, 14]} />
        {mat('#DC2626', '#EF4444', 1.0)}
      </mesh>
      {/* Grin scar */}
      <mesh position={[-0.06, 0.36, 0.17]}><boxGeometry args={[0.05, 0.02, 0.01]} />{mat('#7f1d1d', '#7f1d1d', 0.2)}</mesh>
    </group>
  );

  // Gojo — white uniform, blindfold, infinity rings
  if (unitId.startsWith('blindfolded-sensei')) return (
    <group>
      <Legs legColor="#f1f5f9" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#f1f5f9" emit={auraColor} ei={0.3} />
      {/* Blindfold strip */}
      <mesh position={[0, 0.39, 0.15]}>
        <boxGeometry args={[0.3, 0.07, 0.02]} />
        {mat('#374151', '#374151', 0.1)}
      </mesh>
      {/* Infinity blue glow through blindfold */}
      <mesh position={[-0.08, 0.39, 0.16]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        {mat('#60A5FA', '#3B82F6', 3.0)}
      </mesh>
      <mesh position={[0.08, 0.39, 0.16]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        {mat('#60A5FA', '#3B82F6', 3.0)}
      </mesh>
      {/* Infinity domain ring */}
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.025, 6, 24]} />
        {mat('#A855F7', '#7C3AED', 2.5)}
      </mesh>
    </group>
  );

  // Ichigo — black shinigami robe, spiky orange hair, oversized cleaver
  if (unitId.startsWith('reaper-commander')) return (
    <group>
      <Legs legColor="#0f172a" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#D4A574" />
      {/* Orange hair spike */}
      <mesh position={[0, 0.6, 0.06]} rotation={[0.35, 0, 0]}>
        <coneGeometry args={[0.09, 0.26, 5]} />
        {mat('#F97316', '#FBBF24', 1.0)}
      </mesh>
      {/* Zanpakuto — huge flat cleaver behind */}
      <mesh position={[0.3, 0.12, -0.12]} rotation={[0, 0.3, Math.PI / 8]}>
        <boxGeometry args={[0.08, 0.52, 0.02]} />
        {mat('#475569', '#60A5FA', 0.8)}
      </mesh>
      {/* Bandages on handle */}
      <mesh position={[0.28, -0.05, -0.08]} rotation={[0, 0.3, 0.5]}>
        <boxGeometry args={[0.06, 0.18, 0.025]} />
        {mat('#e2e8f0', '#e2e8f0', 0.1)}
      </mesh>
    </group>
  );

  // Vegeta — blue armor, dark widow's peak hair, flame aura
  if (unitId.startsWith('prideful-warrior')) return (
    <group>
      <Legs legColor="#1e3a5f" />
      <Body bc={color} emit={auraColor} shape="box" />
      <Head hc="#D4A574" />
      {/* Widow's peak dark hair */}
      <mesh position={[0, 0.52, 0.04]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.28, 0.18, 0.2]} />
        {mat('#0f172a', '#0f172a', 0.1)}
      </mesh>
      {/* Hair peak spike */}
      <mesh position={[0, 0.65, 0.05]} rotation={[0.15, 0, 0]}>
        <coneGeometry args={[0.08, 0.2, 4]} />
        {mat('#0f172a', '#0f172a', 0.1)}
      </mesh>
      {/* Armor shoulder pads */}
      <mesh position={[-0.25, 0.25, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.16]} />
        {mat(color, auraColor, 0.6)}
      </mesh>
      <mesh position={[0.25, 0.25, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.16]} />
        {mat(color, auraColor, 0.6)}
      </mesh>
      {/* Ki flame spikes */}
      {[-0.12, 0, 0.12].map((x, i) => (
        <mesh key={i} position={[x, 0.55, 0]}>
          <coneGeometry args={[0.04, 0.18, 4]} />
          {mat('#FBBF24', '#F59E0B', 2.5)}
        </mesh>
      ))}
    </group>
  );

  // Sung Jin-Woo — dark trench coat, glowing blue sovereign eyes, shadow sword
  if (unitId.startsWith('arisen-king')) return (
    <group>
      <Legs legColor="#1e293b" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#1e293b" emit={auraColor} ei={0.4} />
      {/* Dark hair */}
      <mesh position={[0, 0.5, -0.02]}>
        <boxGeometry args={[0.28, 0.14, 0.22]} />
        {mat('#0f172a', '#0f172a', 0.1)}
      </mesh>
      {/* Glowing purple eyes */}
      <mesh position={[-0.07, 0.39, 0.17]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        {mat('#A855F7', '#7C3AED', 4.0)}
      </mesh>
      <mesh position={[0.07, 0.39, 0.17]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        {mat('#A855F7', '#7C3AED', 4.0)}
      </mesh>
      {/* Shadow blade */}
      <mesh position={[0.28, 0.08, 0.1]} rotation={[0.2, 0.2, -Math.PI / 10]}>
        <boxGeometry args={[0.04, 0.48, 0.025]} />
        {mat('#0f172a', '#7C3AED', 2.0)}
      </mesh>
    </group>
  );

  // Gilgamesh — gold armor, golden key shafts emerging from portals
  if (unitId.startsWith('golden-tyrant')) return (
    <group>
      <Legs legColor="#B45309" />
      <Body bc={color} emit={auraColor} shape="box" />
      <Head hc="#D4A574" />
      {/* Gold crown */}
      {[-0.12, 0, 0.12].map((x, i) => (
        <mesh key={i} position={[x, 0.58, 0]}>
          <coneGeometry args={[0.05, 0.16, 4]} />
          {mat('#F59E0B', '#FBBF24', 2.0)}
        </mesh>
      ))}
      {/* Golden key shafts */}
      {[[-0.22, 0.3, 0.1, 0.4], [0.22, 0.28, -0.08, -0.35]].map(([x, y, z, rot], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, rot, -Math.PI / 8 * (i === 0 ? 1 : -1)]}>
          <cylinderGeometry args={[0.025, 0.025, 0.35, 6]} />
          {mat('#F59E0B', '#FBBF24', 2.5)}
        </mesh>
      ))}
      {/* Portal circles */}
      <mesh position={[-0.25, 0.32, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 6, 12]} />
        {mat('#F59E0B', '#FBBF24', 3.0)}
      </mesh>
      <mesh position={[0.25, 0.3, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 6, 12]} />
        {mat('#F59E0B', '#FBBF24', 3.0)}
      </mesh>
    </group>
  );

  // Alucard — red coat, dark wide-brim hat, cross on chest
  if (unitId.startsWith('crimson-alchemist')) return (
    <group>
      <Legs legColor="#1e293b" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#D4A574" />
      {/* Wide-brim hat */}
      <mesh position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.025, 14]} />
        {mat('#1e293b', '#0f172a', 0.1)}
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.16, 10]} />
        {mat('#0f172a', '#0f172a', 0.1)}
      </mesh>
      {/* Cross on chest */}
      <mesh position={[0, 0.16, 0.18]}>
        <boxGeometry args={[0.14, 0.04, 0.015]} />
        {mat('#EF4444', '#DC2626', 2.0)}
      </mesh>
      <mesh position={[0, 0.2, 0.18]}>
        <boxGeometry args={[0.04, 0.16, 0.015]} />
        {mat('#EF4444', '#DC2626', 2.0)}
      </mesh>
      {/* Glasses */}
      <mesh position={[-0.08, 0.39, 0.175]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.04, 0.01, 5, 10]} />
        {mat('#DC2626', '#EF4444', 1.5)}
      </mesh>
      <mesh position={[0.08, 0.39, 0.175]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.04, 0.01, 5, 10]} />
        {mat('#DC2626', '#EF4444', 1.5)}
      </mesh>
    </group>
  );

  // Vasto Lorde (Ichigo hollow) — white bone mask, dark hole in chest
  if (unitId.startsWith('hollow-mask')) return (
    <group>
      <Legs legColor="#0f172a" />
      <Body bc="#0f172a" emit={auraColor} />
      <Head hc="#f1f5f9" />
      {/* Hollow mask (left half face) */}
      <mesh position={[-0.05, 0.39, 0.165]} rotation={[0, 0.3, 0]}>
        <sphereGeometry args={[0.12, 8, 8, 0, Math.PI, 0, Math.PI]} />
        {mat('#f8fafc', '#f1f5f9', 0.4)}
      </mesh>
      {/* Hollow hole in chest */}
      <mesh position={[0, 0.1, 0.18]}>
        <torusGeometry args={[0.06, 0.025, 6, 12]} />
        {mat('#0f172a', auraColor, 1.5)}
      </mesh>
      {/* Bone horn on mask */}
      <mesh position={[-0.12, 0.52, 0.1]} rotation={[0.3, -0.5, -0.4]}>
        <coneGeometry args={[0.03, 0.14, 4]} />
        {mat('#f8fafc', '#f1f5f9', 0.4)}
      </mesh>
    </group>
  );

  // Sukuna — pink tattooed body, 4 eyes, extra mouth
  if (unitId.startsWith('god-of-curses')) return (
    <group>
      <Legs legColor="#7f1d1d" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#D4A574" />
      {/* 4 eyes */}
      {[[-0.08, 0.41], [0.08, 0.41], [-0.08, 0.34], [0.08, 0.34]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.175]}>
          <sphereGeometry args={[0.028, 6, 6]} />
          {mat('#DC2626', '#EF4444', 3.0)}
        </mesh>
      ))}
      {/* Second mouth on cheek */}
      <mesh position={[0.14, 0.36, 0.16]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.07, 0.02, 0.01]} />
        {mat('#0f172a', '#0f172a', 0.2)}
      </mesh>
      {/* Tattoo lines */}
      <mesh position={[0, 0.2, 0.18]}>
        <boxGeometry args={[0.18, 0.015, 0.01]} />
        {mat('#991b1b', '#DC2626', 1.0)}
      </mesh>
      <mesh position={[0, 0.26, 0.18]}>
        <boxGeometry args={[0.14, 0.012, 0.01]} />
        {mat('#991b1b', '#DC2626', 1.0)}
      </mesh>
    </group>
  );

  // Gear 5 Luffy — white fluffy cloud hair, white body, sun halo
  if (unitId.startsWith('solar-warrior')) return (
    <group>
      <Legs legColor="#f1f5f9" />
      <Body bc="#f1f5f9" emit={auraColor} ei={0.3} />
      <Head hc="#f1f5f9" emit={auraColor} ei={0.3} />
      {/* Fluffy white cloud hair */}
      {[[-0.1, 0.58, 0.04], [0.1, 0.58, 0.04], [0, 0.64, 0.02], [-0.14, 0.52, 0.0], [0.14, 0.52, 0.0]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          {mat('#f8fafc', '#f8fafc', 0.3)}
        </mesh>
      ))}
      {/* Sun halo ring */}
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.03, 6, 20]} />
        {mat('#F59E0B', '#FBBF24', 3.0)}
      </mesh>
      {/* Grin */}
      <mesh position={[0, 0.35, 0.175]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.14, 0.025, 0.01]} />
        {mat('#0f172a', '#0f172a', 0.3)}
      </mesh>
    </group>
  );

  // Yhwach — white emperor robe, dark cross, shadowy wing arcs
  if (unitId.startsWith('almighty-father')) return (
    <group>
      <Legs legColor="#1e293b" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#D4A574" />
      {/* Dark beard */}
      <mesh position={[0, 0.33, 0.14]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.16, 0.1, 0.04]} />
        {mat('#1e293b', '#1e293b', 0.1)}
      </mesh>
      {/* Emperor cross on chest */}
      <mesh position={[0, 0.15, 0.18]}>
        <boxGeometry args={[0.16, 0.03, 0.01]} />
        {mat('#1e293b', auraColor, 1.5)}
      </mesh>
      <mesh position={[0, 0.19, 0.18]}>
        <boxGeometry args={[0.03, 0.14, 0.01]} />
        {mat('#1e293b', auraColor, 1.5)}
      </mesh>
      {/* Shadow wing arcs */}
      <mesh position={[-0.36, 0.22, 0]} rotation={[0, 0, 0.8]}>
        <torusGeometry args={[0.18, 0.025, 5, 10, Math.PI * 0.7]} />
        {mat('#0f172a', auraColor, 2.0)}
      </mesh>
      <mesh position={[0.36, 0.22, 0]} rotation={[0, 0, -0.8]}>
        <torusGeometry args={[0.18, 0.025, 5, 10, Math.PI * 0.7]} />
        {mat('#0f172a', auraColor, 2.0)}
      </mesh>
    </group>
  );

  // Beerus — purple cat body, pointy cat ears, divine aura
  if (unitId.startsWith('universe-destroyer')) return (
    <group>
      <Legs legColor={color} />
      <Body bc={color} emit={auraColor} />
      <Head hc={color} emit={auraColor} ei={0.5} />
      {/* Cat ears */}
      <mesh position={[-0.12, 0.58, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.06, 0.17, 4]} />
        {mat(color, auraColor, 0.6)}
      </mesh>
      <mesh position={[0.12, 0.58, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.06, 0.17, 4]} />
        {mat(color, auraColor, 0.6)}
      </mesh>
      {/* Egyptian eyes */}
      <mesh position={[-0.07, 0.4, 0.17]}>
        <sphereGeometry args={[0.032, 6, 6]} />
        {mat('#F59E0B', '#FBBF24', 3.0)}
      </mesh>
      <mesh position={[0.07, 0.4, 0.17]}>
        <sphereGeometry args={[0.032, 6, 6]} />
        {mat('#F59E0B', '#FBBF24', 3.0)}
      </mesh>
      {/* Divine gold halo */}
      <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.24, 0.025, 6, 16]} />
        {mat('#F59E0B', '#FBBF24', 3.5)}
      </mesh>
    </group>
  );

  // Sasuke — dark body, purple Rinnegan eye, Susanoo rib arcs
  if (unitId.startsWith('infinite-rival')) return (
    <group>
      <Legs legColor="#1e1b4b" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#D4A574" />
      {/* Dark spiky hair */}
      <mesh position={[0, 0.52, -0.04]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.28, 0.16, 0.2]} />
        {mat('#0f172a', '#0f172a', 0.1)}
      </mesh>
      <mesh position={[0.12, 0.55, 0.06]} rotation={[0.15, 0.3, 0.4]}>
        <coneGeometry args={[0.06, 0.15, 4]} />
        {mat('#0f172a', '#0f172a', 0.1)}
      </mesh>
      {/* Rinnegan — glowing purple left eye */}
      <mesh position={[-0.08, 0.41, 0.175]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        {mat('#7C3AED', '#A855F7', 4.0)}
      </mesh>
      {/* Rinnegan ring */}
      <mesh position={[-0.08, 0.41, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.04, 0.01, 6, 10]} />
        {mat('#A855F7', '#7C3AED', 3.0)}
      </mesh>
      {/* Sharingan right eye — red */}
      <mesh position={[0.08, 0.41, 0.175]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        {mat('#DC2626', '#EF4444', 3.0)}
      </mesh>
      {/* Susanoo rib arcs */}
      {[-0.28, 0, 0.28].map((z, i) => (
        <mesh key={i} position={[0, 0.12, z]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.22, 0.02, 5, 10, Math.PI]} />
          {mat('#7C3AED', '#A855F7', 2.0)}
        </mesh>
      ))}
    </group>
  );

  // Default fallback
  return (
    <group>
      <Legs legColor={color} />
      <Body bc={color} emit={auraColor} />
      <Head hc={color} emit={auraColor} ei={0.5} />
    </group>
  );
}

// ============================================================
// Placed tower unit in 3D — now with character models
// ============================================================
function TowerMesh({ unitId, gridX, gridZ, placedId, lastAbilityTime }: {
  unitId: string; gridX: number; gridZ: number; placedId: string; lastAbilityTime: number;
}) {
  const bodyRef = useRef<THREE.Group>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const unitData = UNITS[unitId];
  const { useAbility } = useGameStore();

  useFrame((state) => {
    if (!bodyRef.current || !unitData) return;
    const t = state.clock.elapsedTime;
    bodyRef.current.position.y = 0.28 + Math.sin(t * 2 + gridX) * 0.055;
    if (ringRef.current) {
      ringRef.current.rotation.y -= 0.03;
      const cd = unitData.ability.cooldown;
      const elapsed = state.clock.elapsedTime - lastAbilityTime;
      const pct = Math.min(1, elapsed / cd);
      ringRef.current.scale.setScalar(0.8 + pct * 0.3);
    }
  });

  if (!unitData) return null;

  function handleClick(e: any) {
    e.stopPropagation();
    const now = Date.now() / 1000;
    useAbility(placedId, now);
  }

  const abilityReady = Date.now() / 1000 - lastAbilityTime >= unitData.ability.cooldown;

  return (
    <group position={[gridX, 0, gridZ]} onClick={handleClick}>
      {/* Range indicator ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[unitData.stats.range - 0.05, unitData.stats.range, 32]} />
        <meshBasicMaterial color={unitData.auraColor} transparent opacity={0.08} />
      </mesh>

      {/* Base platform */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.45, 0.5, 0.2, 8]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive={unitData.auraColor}
          emissiveIntensity={0.2}
          roughness={0.5}
          metalness={0.8}
        />
      </mesh>

      {/* Rotating orbit ring */}
      <mesh ref={ringRef} position={[0, 0.4, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.4, 0.03, 8, 32]} />
        <meshStandardMaterial
          color={unitData.auraColor}
          emissive={unitData.auraColor}
          emissiveIntensity={abilityReady ? 2.0 : 0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Character model — floats up and down, scaled up */}
      <group ref={bodyRef} castShadow scale={[1.45, 1.45, 1.45]}>
        <CharacterBody unitId={unitId} color={unitData.color} auraColor={unitData.auraColor} />
      </group>

      {/* Aura glow */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial
          color={unitData.auraColor}
          transparent
          opacity={0.12}
          emissive={unitData.auraColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Energy particles */}
      {[0, 1, 2].map(i => (
        <OrbitParticle key={i} color={unitData.trailColor} radius={0.6} speed={1 + i * 0.5} offset={i * (Math.PI * 2 / 3)} />
      ))}
    </group>
  );
}

// Small orbiting particle
function OrbitParticle({ color, radius, speed, offset }: { color: string; radius: number; speed: number; offset: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * radius, 0.4, Math.sin(t) * radius);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 4, 4]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
}

// ============================================================
// Particle effect explosion/nova/etc in 3D
// ============================================================
function EffectMesh({ type, x, z, color, created, radius }: {
  type: string; x: number; z: number; color: string; created: number; radius?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const age = state.clock.elapsedTime - created;
    const progress = Math.min(1, age / 0.5);
    const r = (radius || 2) * progress;
    const opacity = 1 - progress;

    if (ref.current) {
      ref.current.scale.setScalar(r);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.scale.setScalar(r * 1.2);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.8;
    }
  });

  return (
    <group position={[x, 0.3, z]}>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.0, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ============================================================
// Decorative border walls
// ============================================================
function BorderWalls() {
  const wallColor = '#0f172a';
  const wallEmit = '#1e3a5f';
  const h = HALF + 0.5;
  return (
    <group>
      {/* North wall */}
      <mesh position={[0, 0.5, -h]}>
        <boxGeometry args={[GRID_SIZE + 1, 1, 0.5]} />
        <meshStandardMaterial color={wallColor} emissive={wallEmit} emissiveIntensity={0.3} />
      </mesh>
      {/* South wall */}
      <mesh position={[0, 0.5, h]}>
        <boxGeometry args={[GRID_SIZE + 1, 1, 0.5]} />
        <meshStandardMaterial color={wallColor} emissive={wallEmit} emissiveIntensity={0.3} />
      </mesh>
      {/* East wall */}
      <mesh position={[h, 0.5, 0]}>
        <boxGeometry args={[0.5, 1, GRID_SIZE + 1]} />
        <meshStandardMaterial color={wallColor} emissive={wallEmit} emissiveIntensity={0.3} />
      </mesh>
      {/* West wall */}
      <mesh position={[-h, 0.5, 0]}>
        <boxGeometry args={[0.5, 1, GRID_SIZE + 1]} />
        <meshStandardMaterial color={wallColor} emissive={wallEmit} emissiveIntensity={0.3} />
      </mesh>

      {/* Corner towers */}
      {[[-h, -h], [h, -h], [-h, h], [h, h]].map(([cx, cz], i) => (
        <mesh key={i} position={[cx, 0.7, cz]}>
          <cylinderGeometry args={[0.4, 0.5, 1.4, 8]} />
          <meshStandardMaterial color="#1e293b" emissive="#3B82F6" emissiveIntensity={0.5} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================
// Game tick — updates game state every frame
// ============================================================
function GameTick() {
  const { updateGame, game } = useGameStore();
  const lastTime = useRef(Date.now() / 1000);

  useFrame(() => {
    if (game.isPaused || game.isGameOver) return;
    const now = Date.now() / 1000;
    const delta = Math.min(now - lastTime.current, 0.1); // cap delta
    lastTime.current = now;
    updateGame(delta, now);
  });

  return null;
}

// ============================================================
// Camera setup — low isometric 3rd-person view
// ============================================================
function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 8, 9);
    camera.lookAt(0, 0, -2);
    (camera as THREE.PerspectiveCamera).fov = 62;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  }, [camera]);
  return null;
}

// ============================================================
// Cell highlight when hovering (placement preview)
// ============================================================
function CellHighlight({ x, z, color }: { x: number; z: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
    }
  });
  return (
    <mesh ref={ref} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.9, 0.9]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

// ============================================================
// Main 3D Scene
// ============================================================
function Scene({ selectedUnitId, hoveredCell, onCellClick, onCellHover }: {
  selectedUnitId: string | null;
  hoveredCell: [number, number] | null;
  onCellClick: (x: number, z: number) => void;
  onCellHover: (x: number, z: number) => void;
}) {
  const { game } = useGameStore();

  return (
    <>
      <CameraSetup />
      <GameTick />

      {/* Lighting — brighter so models are visible */}
      <ambientLight intensity={1.0} color="#d0e0ff" />
      <directionalLight position={[5, 12, 8]} intensity={2.0} color="#ffffff" castShadow />
      <pointLight position={[0, 7, 0]} intensity={1.8} color="#3B82F6" />
      <pointLight position={[-5, 4, -5]} intensity={1.2} color="#7C3AED" />
      <pointLight position={[5, 4, 5]} intensity={1.2} color="#EF4444" />
      <hemisphereLight args={['#1e3a5f', '#1e293b', 1.0]} />

      {/* Fog — pull back so units are visible */}
      <fog attach="fog" args={['#050510', 24, 44]} />

      {/* Floor & path */}
      <GameFloor onCellClick={onCellClick} selectedUnitId={selectedUnitId} />

      {/* Border walls */}
      <BorderWalls />

      {/* Hover highlight */}
      {hoveredCell && selectedUnitId && !isOnPath(hoveredCell[0], hoveredCell[1]) && (
        <CellHighlight
          x={hoveredCell[0]}
          z={hoveredCell[1]}
          color={UNITS[selectedUnitId]?.auraColor || '#60A5FA'}
        />
      )}

      {/* Placed tower units */}
      {game.placedUnits.map(pu => (
        <TowerMesh
          key={pu.id}
          unitId={pu.unitId}
          gridX={pu.gridX}
          gridZ={pu.gridZ}
          placedId={pu.id}
          lastAbilityTime={pu.lastAbilityTime}
        />
      ))}

      {/* Enemies */}
      {game.enemies.map(e => (
        <EnemyMesh
          key={e.id}
          enemyId={e.enemyId}
          progress={e.position}
          hp={e.hp}
          maxHp={e.maxHp}
          isBoss={e.isBoss}
          bossPhase={e.bossPhase}
          size={e.size}
          color={e.color}
          auraColor={e.auraColor}
          slowFactor={e.slowFactor}
        />
      ))}

      {/* Particle effects */}
      {game.effects.map(ef => (
        <EffectMesh
          key={ef.id}
          type={ef.type}
          x={ef.x}
          z={ef.z}
          color={ef.color}
          created={ef.created}
          radius={ef.radius}
        />
      ))}
    </>
  );
}

// ============================================================
// Game View Root — wraps Canvas + HUD
// ============================================================
export default function GameView() {
  const { game, equippedUnitIds, placeUnit, resetGame } = useGameStore();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);

  function handleCellClick(x: number, z: number) {
    if (!selectedUnitId) return;
    const ok = placeUnit(selectedUnitId, x, z);
    if (ok) setSelectedUnitId(null);
  }

  function handleCellHover(x: number, z: number) {
    setHoveredCell([x, z]);
  }

  if (game.isGameOver) {
    return (
      <div className="game-over-screen">
        <div className="game-over-card">
          <div className="game-over-title">GAME OVER</div>
          <div className="game-over-wave">Survived {game.wave} waves</div>
          <div className="game-over-score">Score: {game.score.toLocaleString()}</div>
          <button className="game-over-btn" onClick={resetGame}>
            ← Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#050510' }}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onPointerMove={(e) => {
          // handled inside Scene via raycasting
        }}
      >
        <Scene
          selectedUnitId={selectedUnitId}
          hoveredCell={hoveredCell}
          onCellClick={handleCellClick}
          onCellHover={handleCellHover}
        />
      </Canvas>

      {/* Game HUD overlay */}
      <GameUI
        selectedUnitId={selectedUnitId}
        onSelectUnit={setSelectedUnitId}
        equippedUnitIds={equippedUnitIds}
      />
    </div>
  );
}
