// ============================================================
// SHARED CHARACTER MODELS — used in reveal banner + game view
// ============================================================

export function CharacterBody({ unitId, color, auraColor }: {
  unitId: string; color: string; auraColor: string;
}) {
  const mat = (c: string, emit?: string, ei = 0.55) => (
    <meshStandardMaterial color={c} emissive={emit ?? c} emissiveIntensity={ei} roughness={0.35} metalness={0.1} />
  );

  const Legs = ({ lc, rc }: { lc: string; rc?: string }) => (
    <>
      <mesh position={[-0.13, -0.14, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.065, 0.28, 8]} />
        {mat(lc)}
      </mesh>
      <mesh position={[0.13, -0.14, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.065, 0.28, 8]} />
        {mat(rc ?? lc)}
      </mesh>
    </>
  );

  const Head = ({ hc, emit, ei = 0.3 }: { hc: string; emit?: string; ei?: number }) => (
    <mesh position={[0, 0.46, 0]} castShadow>
      <sphereGeometry args={[0.22, 12, 12]} />
      {mat(hc, emit ?? hc, ei)}
    </mesh>
  );

  const Body = ({ bc, emit, ei = 0.6, shape = 'cyl' }: { bc: string; emit?: string; ei?: number; shape?: string }) => (
    <mesh position={[0, 0.15, 0]} castShadow>
      {shape === 'box'
        ? <boxGeometry args={[0.38, 0.46, 0.32]} />
        : <cylinderGeometry args={[0.21, 0.22, 0.46, 10]} />}
      {mat(bc, emit ?? bc, ei)}
    </mesh>
  );

  // ── Naruto Six Paths ─────────────────────────────────────
  if (unitId.startsWith('orange-outcast')) return (
    <group>
      <Legs lc={color} />
      <Body bc={color} emit={auraColor} />
      <Head hc="#FBBF24" emit="#F59E0B" ei={0.4} />
      {/* Spiky hair cluster */}
      {[[0, 0.72, 0.06, 0.4], [-0.11, 0.67, 0, 0.2], [0.11, 0.67, 0, 0.2]].map(([x, y, z, rx], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[rx, 0, 0]} castShadow>
          <coneGeometry args={[0.1, 0.24, 5]} />
          {mat('#FBBF24', '#F59E0B', 1.2)}
        </mesh>
      ))}
      {/* Six-path chakra rings */}
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.36, 0.022, 6, 24]} />
        {mat('#a78bfa', '#7C3AED', 2.5)}
      </mesh>
      {/* Whiskers */}
      <mesh position={[-0.11, 0.46, 0.21]}><boxGeometry args={[0.12, 0.015, 0.01]} />{mat('#1e293b', '#1e293b', 0)}</mesh>
      <mesh position={[0.11, 0.46, 0.21]}><boxGeometry args={[0.12, 0.015, 0.01]} />{mat('#1e293b', '#1e293b', 0)}</mesh>
      {/* Sage mode orange eyes */}
      <mesh position={[-0.09, 0.47, 0.21]}><sphereGeometry args={[0.038, 6, 6]} />{mat('#F97316', '#F59E0B', 3.0)}</mesh>
      <mesh position={[0.09, 0.47, 0.21]}><sphereGeometry args={[0.038, 6, 6]} />{mat('#F97316', '#F59E0B', 3.0)}</mesh>
    </group>
  );

  // ── Tanjiro ───────────────────────────────────────────────
  if (unitId.startsWith('green-trainee')) return (
    <group>
      <Legs lc="#1e3a2a" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#D4A574" />
      <mesh position={[0, 0.62, -0.07]} rotation={[-0.22, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.16, 0.26]} />
        {mat('#1e293b', '#1e293b', 0.15)}
      </mesh>
      {/* Forehead scar */}
      <mesh position={[-0.06, 0.5, 0.21]}><boxGeometry args={[0.09, 0.03, 0.01]} />{mat('#DC2626', '#EF4444', 2.0)}</mesh>
      {/* Hanafuda earring */}
      <mesh position={[-0.23, 0.43, 0.1]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.06, 0.016, 6, 12]} />
        {mat('#DC2626', '#EF4444', 2.0)}
      </mesh>
      {/* Hinokami water ring */}
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.022, 6, 24]} />
        {mat('#60A5FA', '#3B82F6', 2.5)}
      </mesh>
    </group>
  );

  // ── Luffy ─────────────────────────────────────────────────
  if (unitId.startsWith('rubber-captain')) return (
    <group>
      <Legs lc="#1e3a5f" />
      <Body bc={color} emit={auraColor} shape="box" />
      <Head hc="#D4A574" />
      {/* Straw hat brim */}
      <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.025, 14]} />
        {mat('#D97706', '#B45309', 0.4)}
      </mesh>
      <mesh position={[0, 0.74, 0]}><coneGeometry args={[0.18, 0.22, 12]} />{mat('#D97706', '#B45309', 0.4)}</mesh>
      <mesh position={[0, 0.625, 0]}><torusGeometry args={[0.23, 0.035, 6, 16]} />{mat('#DC2626', '#EF4444', 1.5)}</mesh>
      {/* Red X scar on cheek */}
      <mesh position={[-0.07, 0.44, 0.21]}><boxGeometry args={[0.06, 0.022, 0.01]} />{mat('#7f1d1d', '#7f1d1d', 0.4)}</mesh>
      {/* Grin teeth */}
      <mesh position={[0, 0.42, 0.22]}><boxGeometry args={[0.12, 0.02, 0.01]} />{mat('#f1f5f9', '#f1f5f9', 0.2)}</mesh>
    </group>
  );

  // ── Gojo Satoru ───────────────────────────────────────────
  if (unitId.startsWith('blindfolded-sensei')) return (
    <group>
      <Legs lc="#f1f5f9" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#f8fafc" emit={auraColor} ei={0.2} />
      {/* White hair floof */}
      <mesh position={[0, 0.66, 0.04]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.34, 0.18, 0.26]} />
        {mat('#f8fafc', '#f1f5f9', 0.3)}
      </mesh>
      {/* Blindfold */}
      <mesh position={[0, 0.48, 0.19]}>
        <boxGeometry args={[0.36, 0.085, 0.025]} />
        {mat('#374151', '#374151', 0.15)}
      </mesh>
      {/* Infinity glow eyes behind blindfold */}
      <mesh position={[-0.1, 0.48, 0.2]}><sphereGeometry args={[0.036, 6, 6]} />{mat('#60A5FA', '#3B82F6', 4.0)}</mesh>
      <mesh position={[0.1, 0.48, 0.2]}><sphereGeometry args={[0.036, 6, 6]} />{mat('#60A5FA', '#3B82F6', 4.0)}</mesh>
      {/* Infinity domain ring */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.03, 6, 28]} />
        {mat('#A855F7', '#7C3AED', 3.0)}
      </mesh>
      {/* Inner ring */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
        <torusGeometry args={[0.26, 0.02, 6, 20]} />
        {mat('#60A5FA', '#3B82F6', 2.5)}
      </mesh>
    </group>
  );

  // ── Ichigo ────────────────────────────────────────────────
  if (unitId.startsWith('reaper-commander')) return (
    <group>
      <Legs lc="#0f172a" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#D4A574" />
      {/* Spiky orange hair */}
      <mesh position={[0, 0.75, 0.07]} rotation={[0.35, 0, 0]} castShadow>
        <coneGeometry args={[0.11, 0.3, 5]} />
        {mat('#F97316', '#FBBF24', 1.4)}
      </mesh>
      <mesh position={[-0.1, 0.68, 0.04]} rotation={[0.2, -0.3, -0.2]} castShadow>
        <coneGeometry args={[0.08, 0.22, 5]} />
        {mat('#F97316', '#FBBF24', 1.4)}
      </mesh>
      {/* Zangetsu oversized cleaver */}
      <mesh position={[0.35, 0.14, -0.14]} rotation={[0, 0.3, Math.PI / 9]}>
        <boxGeometry args={[0.11, 0.64, 0.025]} />
        {mat('#475569', '#60A5FA', 1.0)}
      </mesh>
      {/* Wrapped handle */}
      <mesh position={[0.32, -0.06, -0.1]} rotation={[0, 0.3, 0.55]}>
        <boxGeometry args={[0.08, 0.22, 0.03]} />
        {mat('#e2e8f0', '#e2e8f0', 0.2)}
      </mesh>
      {/* Hollow eye ring */}
      <mesh position={[-0.1, 0.47, 0.21]}><sphereGeometry args={[0.04, 6, 6]} />{mat('#7f1d1d', '#DC2626', 2.0)}</mesh>
    </group>
  );

  // ── Vegeta ────────────────────────────────────────────────
  if (unitId.startsWith('prideful-warrior')) return (
    <group>
      <Legs lc="#1e3a5f" />
      <Body bc={color} emit={auraColor} shape="box" />
      <Head hc="#D4A574" />
      {/* Widow's peak hair */}
      <mesh position={[0, 0.62, 0.05]} rotation={[0.25, 0, 0]} castShadow>
        <boxGeometry args={[0.32, 0.22, 0.24]} />
        {mat('#0f172a', '#0f172a', 0.15)}
      </mesh>
      <mesh position={[0, 0.78, 0.06]} rotation={[0.18, 0, 0]} castShadow>
        <coneGeometry args={[0.1, 0.24, 4]} />
        {mat('#0f172a', '#0f172a', 0.15)}
      </mesh>
      {/* Armor shoulder pads */}
      <mesh position={[-0.3, 0.28, 0]}><boxGeometry args={[0.14, 0.14, 0.2]} />{mat(color, auraColor, 0.8)}</mesh>
      <mesh position={[0.3, 0.28, 0]}><boxGeometry args={[0.14, 0.14, 0.2]} />{mat(color, auraColor, 0.8)}</mesh>
      {/* Super Saiyan aura flames */}
      {[-0.15, 0, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.7, 0]}>
          <coneGeometry args={[0.05, 0.22, 4]} />
          {mat('#FBBF24', '#F59E0B', 3.0)}
        </mesh>
      ))}
    </group>
  );

  // ── Sung Jin-Woo ──────────────────────────────────────────
  if (unitId.startsWith('arisen-king')) return (
    <group>
      <Legs lc="#1e293b" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#1a1f2e" emit={auraColor} ei={0.5} />
      {/* Dark hair */}
      <mesh position={[0, 0.6, -0.02]}>
        <boxGeometry args={[0.32, 0.17, 0.26]} />
        {mat('#0f172a', '#0f172a', 0.15)}
      </mesh>
      {/* Sovereign glowing purple eyes */}
      <mesh position={[-0.09, 0.47, 0.21]}><sphereGeometry args={[0.042, 6, 6]} />{mat('#A855F7', '#7C3AED', 5.0)}</mesh>
      <mesh position={[0.09, 0.47, 0.21]}><sphereGeometry args={[0.042, 6, 6]} />{mat('#A855F7', '#7C3AED', 5.0)}</mesh>
      {/* Shadow ruler sword */}
      <mesh position={[0.32, 0.1, 0.12]} rotation={[0.2, 0.2, -Math.PI / 10]}>
        <boxGeometry args={[0.05, 0.58, 0.03]} />
        {mat('#0f172a', '#7C3AED', 2.5)}
      </mesh>
      {/* Shadow particles */}
      {[0, 1, 2, 3].map(i => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.38, 0.15, Math.sin(angle) * 0.38]}>
            <sphereGeometry args={[0.04, 4, 4]} />
            {mat('#0f172a', '#7C3AED', 3.0)}
          </mesh>
        );
      })}
    </group>
  );

  // ── Gilgamesh ─────────────────────────────────────────────
  if (unitId.startsWith('golden-tyrant')) return (
    <group>
      <Legs lc="#B45309" />
      <Body bc={color} emit={auraColor} shape="box" />
      <Head hc="#D4A574" emit="#D4A574" ei={0.2} />
      {/* Crown spikes */}
      {[-0.14, 0, 0.14].map((x, i) => (
        <mesh key={i} position={[x, 0.72, 0]}>
          <coneGeometry args={[0.06, 0.2, 4]} />
          {mat('#F59E0B', '#FBBF24', 2.5)}
        </mesh>
      ))}
      {/* Red eyes */}
      <mesh position={[-0.09, 0.47, 0.22]}><sphereGeometry args={[0.04, 6, 6]} />{mat('#EF4444', '#DC2626', 3.0)}</mesh>
      <mesh position={[0.09, 0.47, 0.22]}><sphereGeometry args={[0.04, 6, 6]} />{mat('#EF4444', '#DC2626', 3.0)}</mesh>
      {/* Gate of Babylon portals */}
      {[[-0.3, 0.36, 0.12, 0.5], [0.3, 0.32, -0.1, -0.45]].map(([x, y, z, rot], i) => (
        <group key={i}>
          <mesh position={[x, y, z]} rotation={[Math.PI / 2, 0, rot]}>
            <torusGeometry args={[0.1, 0.025, 6, 14]} />
            {mat('#F59E0B', '#FBBF24', 3.5)}
          </mesh>
          <mesh position={[x, y, z]} rotation={[0, rot, -Math.PI / 8 * (i === 0 ? 1 : -1)]}>
            <cylinderGeometry args={[0.03, 0.03, 0.42, 6]} />
            {mat('#F59E0B', '#FBBF24', 3.0)}
          </mesh>
        </group>
      ))}
    </group>
  );

  // ── Alucard ───────────────────────────────────────────────
  if (unitId.startsWith('crimson-alchemist')) return (
    <group>
      <Legs lc="#1e293b" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#D4A574" />
      {/* Wide-brim hat brim */}
      <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.028, 16]} />
        {mat('#1e293b', '#0f172a', 0.15)}
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.2, 12]} />
        {mat('#0f172a', '#0f172a', 0.15)}
      </mesh>
      {/* Cross on chest */}
      <mesh position={[0, 0.18, 0.22]}><boxGeometry args={[0.18, 0.05, 0.015]} />{mat('#EF4444', '#DC2626', 2.5)}</mesh>
      <mesh position={[0, 0.23, 0.22]}><boxGeometry args={[0.05, 0.2, 0.015]} />{mat('#EF4444', '#DC2626', 2.5)}</mesh>
      {/* Red round glasses */}
      <mesh position={[-0.1, 0.47, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.048, 0.013, 5, 12]} />
        {mat('#DC2626', '#EF4444', 2.0)}
      </mesh>
      <mesh position={[0.1, 0.47, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.048, 0.013, 5, 12]} />
        {mat('#DC2626', '#EF4444', 2.0)}
      </mesh>
      {/* Darkness aura */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshBasicMaterial color="#7f1d1d" transparent opacity={0.1} />
      </mesh>
    </group>
  );

  // ── Vasto Lorde ───────────────────────────────────────────
  if (unitId.startsWith('hollow-mask')) return (
    <group>
      <Legs lc="#0f172a" />
      <Body bc="#0f172a" emit={auraColor} />
      <Head hc="#f1f5f9" emit={auraColor} ei={0.2} />
      {/* Hollow bone mask — half face */}
      <mesh position={[-0.06, 0.47, 0.2]} rotation={[0, 0.35, 0]}>
        <sphereGeometry args={[0.145, 8, 8, 0, Math.PI, 0, Math.PI]} />
        {mat('#f8fafc', '#f1f5f9', 0.6)}
      </mesh>
      {/* Bone horns */}
      <mesh position={[-0.15, 0.64, 0.12]} rotation={[0.3, -0.5, -0.4]}>
        <coneGeometry args={[0.035, 0.18, 4]} />
        {mat('#f8fafc', '#f1f5f9', 0.5)}
      </mesh>
      {/* Hollow hole */}
      <mesh position={[0, 0.12, 0.22]}>
        <torusGeometry args={[0.07, 0.03, 6, 14]} />
        {mat('#0f172a', auraColor, 2.0)}
      </mesh>
      {/* Cero blast charge */}
      <mesh position={[0.2, 0.47, 0.18]}><sphereGeometry args={[0.07, 6, 6]} />{mat('#E879F9', '#A855F7', 4.0)}</mesh>
    </group>
  );

  // ── Sukuna ────────────────────────────────────────────────
  if (unitId.startsWith('god-of-curses')) return (
    <group>
      <Legs lc="#7f1d1d" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#D4A574" />
      {/* 4 eyes (2 rows) */}
      {[[-0.09, 0.49], [0.09, 0.49], [-0.09, 0.41], [0.09, 0.41]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.21]}>
          <sphereGeometry args={[0.034, 6, 6]} />
          {mat('#DC2626', '#EF4444', 3.5)}
        </mesh>
      ))}
      {/* Extra mouth on cheek */}
      <mesh position={[0.17, 0.43, 0.2]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.085, 0.025, 0.01]} />
        {mat('#0f172a', '#0f172a', 0.3)}
      </mesh>
      {/* Tattoo lines */}
      <mesh position={[0, 0.24, 0.22]}><boxGeometry args={[0.22, 0.018, 0.01]} />{mat('#991b1b', '#DC2626', 1.5)}</mesh>
      <mesh position={[0, 0.31, 0.22]}><boxGeometry args={[0.17, 0.015, 0.01]} />{mat('#991b1b', '#DC2626', 1.5)}</mesh>
      {/* Cursed energy ring */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.025, 6, 24]} />
        {mat('#DC2626', '#EF4444', 2.5)}
      </mesh>
    </group>
  );

  // ── Gear 5 Luffy ──────────────────────────────────────────
  if (unitId.startsWith('solar-warrior')) return (
    <group>
      <Legs lc="#f1f5f9" />
      <Body bc="#f1f5f9" emit={auraColor} ei={0.35} />
      <Head hc="#f1f5f9" emit={auraColor} ei={0.3} />
      {/* Cloud-puff white hair */}
      {[[-0.13, 0.7, 0.05], [0.13, 0.7, 0.05], [0, 0.78, 0.02],
        [-0.18, 0.63, 0], [0.18, 0.63, 0], [0, 0.64, 0.09]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          {mat('#f8fafc', '#f8fafc', 0.4)}
        </mesh>
      ))}
      {/* Sun halo ring */}
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.038, 6, 24]} />
        {mat('#F59E0B', '#FBBF24', 3.5)}
      </mesh>
      {/* Sun ray spikes */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.55, 0.5, Math.sin(angle) * 0.55]}
            rotation={[0, -angle, 0]}>
            <coneGeometry args={[0.04, 0.16, 4]} />
            {mat('#F59E0B', '#FBBF24', 3.0)}
          </mesh>
        );
      })}
      {/* Wild grin */}
      <mesh position={[0, 0.42, 0.22]}><boxGeometry args={[0.18, 0.03, 0.01]} />{mat('#0f172a', '#0f172a', 0.4)}</mesh>
    </group>
  );

  // ── Yhwach ────────────────────────────────────────────────
  if (unitId.startsWith('almighty-father')) return (
    <group>
      <Legs lc="#1e293b" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#D4A574" />
      {/* Thick beard */}
      <mesh position={[0, 0.39, 0.17]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.19, 0.13, 0.05]} />
        {mat('#1e293b', '#1e293b', 0.2)}
      </mesh>
      {/* Almighty eyes — golden */}
      <mesh position={[-0.09, 0.48, 0.21]}><sphereGeometry args={[0.04, 6, 6]} />{mat('#F59E0B', '#FBBF24', 4.0)}</mesh>
      <mesh position={[0.09, 0.48, 0.21]}><sphereGeometry args={[0.04, 6, 6]} />{mat('#F59E0B', '#FBBF24', 4.0)}</mesh>
      {/* White emperor cross */}
      <mesh position={[0, 0.17, 0.22]}><boxGeometry args={[0.2, 0.038, 0.012]} />{mat('#1e293b', auraColor, 2.0)}</mesh>
      <mesh position={[0, 0.22, 0.22]}><boxGeometry args={[0.038, 0.18, 0.012]} />{mat('#1e293b', auraColor, 2.0)}</mesh>
      {/* Shadow wing arcs — large */}
      <mesh position={[-0.44, 0.28, 0]} rotation={[0, 0, 0.75]}>
        <torusGeometry args={[0.22, 0.03, 5, 12, Math.PI * 0.75]} />
        {mat('#0f172a', auraColor, 2.5)}
      </mesh>
      <mesh position={[0.44, 0.28, 0]} rotation={[0, 0, -0.75]}>
        <torusGeometry args={[0.22, 0.03, 5, 12, Math.PI * 0.75]} />
        {mat('#0f172a', auraColor, 2.5)}
      </mesh>
    </group>
  );

  // ── Beerus ────────────────────────────────────────────────
  if (unitId.startsWith('universe-destroyer')) return (
    <group>
      <Legs lc={color} />
      <Body bc={color} emit={auraColor} />
      <Head hc={color} emit={auraColor} ei={0.6} />
      {/* Cat ears */}
      <mesh position={[-0.16, 0.71, 0]} rotation={[0, 0, 0.35]}>
        <coneGeometry args={[0.075, 0.2, 4]} />
        {mat(color, auraColor, 0.8)}
      </mesh>
      <mesh position={[0.16, 0.71, 0]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.075, 0.2, 4]} />
        {mat(color, auraColor, 0.8)}
      </mesh>
      {/* Golden Egyptian eyes */}
      <mesh position={[-0.09, 0.47, 0.21]}><sphereGeometry args={[0.04, 6, 6]} />{mat('#F59E0B', '#FBBF24', 4.0)}</mesh>
      <mesh position={[0.09, 0.47, 0.21]}><sphereGeometry args={[0.04, 6, 6]} />{mat('#F59E0B', '#FBBF24', 4.0)}</mesh>
      {/* Divine destruction halo */}
      <mesh position={[0, 0.66, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.03, 6, 20]} />
        {mat('#F59E0B', '#FBBF24', 4.0)}
      </mesh>
      {/* Ultra instinct aura */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.6, 10, 10]} />
        <meshBasicMaterial color={auraColor} transparent opacity={0.1} />
      </mesh>
    </group>
  );

  // ── Sasuke ────────────────────────────────────────────────
  if (unitId.startsWith('infinite-rival')) return (
    <group>
      <Legs lc="#1e1b4b" />
      <Body bc={color} emit={auraColor} />
      <Head hc="#D4A574" />
      {/* Dark spiky hair */}
      <mesh position={[0, 0.62, -0.05]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.32, 0.19, 0.24]} />
        {mat('#0f172a', '#0f172a', 0.15)}
      </mesh>
      <mesh position={[0.15, 0.66, 0.07]} rotation={[0.18, 0.35, 0.45]} castShadow>
        <coneGeometry args={[0.07, 0.18, 4]} />
        {mat('#0f172a', '#0f172a', 0.15)}
      </mesh>
      {/* Rinnegan — glowing purple left eye */}
      <mesh position={[-0.1, 0.49, 0.21]}><sphereGeometry args={[0.046, 8, 8]} />{mat('#7C3AED', '#A855F7', 5.0)}</mesh>
      <mesh position={[-0.1, 0.49, 0.215]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.046, 0.012, 6, 12]} />
        {mat('#A855F7', '#7C3AED', 4.0)}
      </mesh>
      {/* Sharingan right eye */}
      <mesh position={[0.1, 0.49, 0.21]}><sphereGeometry args={[0.038, 6, 6]} />{mat('#DC2626', '#EF4444', 4.0)}</mesh>
      {/* Susanoo ribcage arcs — bigger */}
      {[-0.35, 0, 0.35].map((z, i) => (
        <mesh key={i} position={[0, 0.15, z]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.28, 0.025, 5, 12, Math.PI]} />
          {mat('#7C3AED', '#A855F7', 2.5)}
        </mesh>
      ))}
      {/* Chidori lightning bolt */}
      <mesh position={[0.38, 0.3, 0.12]} rotation={[0.4, 0.2, -0.6]}>
        <cylinderGeometry args={[0.025, 0.04, 0.3, 4]} />
        {mat('#60A5FA', '#3B82F6', 4.0)}
      </mesh>
    </group>
  );

  // ── Default fallback ──────────────────────────────────────
  return (
    <group>
      <Legs lc={color} />
      <Body bc={color} emit={auraColor} />
      <Head hc={color} emit={auraColor} ei={0.6} />
    </group>
  );
}
