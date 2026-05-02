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
// Placed tower unit in 3D
// ============================================================
function TowerMesh({ unitId, gridX, gridZ, placedId, lastAbilityTime }: {
  unitId: string; gridX: number; gridZ: number; placedId: string; lastAbilityTime: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const unitData = UNITS[unitId];
  const { useAbility } = useGameStore();

  useFrame((state) => {
    if (!meshRef.current || !unitData) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = 0.4 + Math.sin(t * 2 + gridX) * 0.06;
    meshRef.current.rotation.y += 0.02;
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

      {/* Unit body */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshStandardMaterial
          color={unitData.color}
          emissive={unitData.auraColor}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

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
// Camera setup — isometric top-down view
// ============================================================
function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 14, 10);
    camera.lookAt(0, 0, 0);
    (camera as THREE.PerspectiveCamera).fov = 55;
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

      {/* Lighting */}
      <ambientLight intensity={0.4} color="#1e3a5f" />
      <directionalLight position={[5, 12, 8]} intensity={1.2} color="#ffffff" castShadow />
      <pointLight position={[0, 8, 0]} intensity={0.8} color="#3B82F6" />
      <pointLight position={[-5, 4, -5]} intensity={0.5} color="#7C3AED" />
      <pointLight position={[5, 4, 5]} intensity={0.5} color="#EF4444" />
      <hemisphereLight args={['#0f172a', '#1e293b', 0.5]} />

      {/* Fog */}
      <fog attach="fog" args={['#050510', 20, 40]} />

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
