import { useState, useEffect } from 'react';
import { supabase } from '../../shared/services/supabase';

interface Stats {
  totalUsers: number;
  presentToday: number;
  totalLocations: number;
  recordsToday: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, presentToday: 0, totalLocations: 0, recordsToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStart = today.toISOString();

      const [{ count: userCount }, { count: locationCount }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('locations').select('*', { count: 'exact', head: true }),
      ]);

      const { data: records } = await supabase
        .from('attendance_records')
        .select('*')
        .gte('check_in', todayStart);

      const presentUsers = new Set(records?.map(r => r.user_id));
      const uniqueRecords = records?.filter((r, i, arr) =>
        arr.findIndex(x => x.user_id === r.user_id) === i
      );

      setStats({
        totalUsers: userCount || 0,
        presentToday: presentUsers.size || 0,
        totalLocations: locationCount || 0,
        recordsToday: uniqueRecords?.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p className="font-body-sm text-body-sm text-on-surface-variant" style={{ marginTop: 16 }}>Carregando dados...</p>
        </div>
      </div>
    );
  }

  const attendanceRate = stats.totalUsers > 0 ? Math.round((stats.presentToday / stats.totalUsers) * 100) : 0;

  return (
    <div className="animate-fade-in">
      {/* Page Title */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="font-headline-md text-headline-md text-primary" style={{ marginBottom: 4 }}>Painel do Administrador</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Visão geral do sistema de presença em tempo real</p>
      </div>

      {/* Bento Grid Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, marginBottom: 32 }}>
        
        {/* Taxa de Presença - Large */}
        <div style={{
          gridColumn: 'span 8',
          background: 'var(--surface-container-lowest)',
          borderRadius: 12,
          padding: 32,
          border: '1px solid var(--outline-variant)',
          boxShadow: '0 2px 8px rgba(0,30,64,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant" style={{ marginBottom: 8 }}>TAXA DE PRESENÇA HOJE</p>
              <h2 className="font-display-lg text-display-lg text-primary">{attendanceRate}%</h2>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'var(--secondary-container)', color: 'var(--on-secondary-container)',
              padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>trending_up</span>
              Atualizado agora
            </span>
          </div>

          {/* Mock Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, paddingTop: 16 }}>
            {[85, 92, 88, 94, 96, 60, 40].map((h, i) => (
              <div key={i} style={{
                flex: 1,
                height: `${h}%`,
                background: i === 4 ? 'var(--primary)' : 'var(--surface-container-high)',
                borderRadius: '4px 4px 0 0',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map(d => (
              <span key={d} className="font-label-bold text-label-bold text-on-surface-variant">{d}</span>
            ))}
          </div>
        </div>

        {/* Stats Stack */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <StatMini
            label="PRESENTES HOJE"
            value={`${stats.presentToday} / ${stats.totalUsers}`}
            icon="person_check"
            iconBg="var(--primary-fixed)"
            iconColor="var(--primary)"
            valueColor="var(--primary)"
          />
          <StatMini
            label="LOCAIS ATIVOS"
            value={String(stats.totalLocations)}
            icon="location_on"
            iconBg="var(--tertiary-fixed)"
            iconColor="var(--tertiary)"
            valueColor="var(--tertiary)"
          />
          <StatMini
            label="REGISTROS HOJE"
            value={String(stats.recordsToday)}
            icon="schedule"
            iconBg="var(--error-container)"
            iconColor="var(--error)"
            valueColor="var(--error)"
          />
        </div>
      </div>

      {/* Bottom Bento Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {/* Total Colaboradores */}
        <div style={{
          background: 'var(--primary)',
          color: 'var(--on-primary)',
          borderRadius: 12,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 160,
        }}>
          <div>
            <span className="material-symbols-outlined" style={{ fontSize: 36, fontVariationSettings: "'FILL' 1", opacity: 0.8 }}>group_add</span>
            <h4 className="font-headline-sm text-headline-sm" style={{ marginTop: 8 }}>Total de Colaboradores</h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 24 }}>
            <span className="font-display-lg text-display-lg">{stats.totalUsers}</span>
            <span style={{
              background: 'var(--primary-container)', color: 'var(--on-primary-container)',
              padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700
            }}>Sistema</span>
          </div>
        </div>

        {/* Presença */}
        <div style={{
          background: 'var(--surface-container-high)',
          borderRadius: 12,
          padding: 24,
          border: '1px solid var(--outline-variant)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 160,
        }}>
          <div>
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 36 }}>how_to_reg</span>
            <h4 className="font-headline-sm text-headline-sm text-primary" style={{ marginTop: 8 }}>Taxa de Presença</h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 24 }}>
            <span className="font-display-lg text-display-lg text-primary">{attendanceRate}%</span>
            <div style={{ display: 'flex', gap: -8 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: ['var(--surface-dim)','var(--surface-container-highest)','var(--primary-container)'][i-1],
                  border: '2px solid var(--surface-container-high)',
                  marginLeft: i > 1 ? -8 : 0,
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Sessões Ativas */}
        <div style={{
          background: 'var(--secondary-container)',
          color: 'var(--on-secondary-container)',
          borderRadius: 12,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 160,
        }}>
          <div>
            <span className="material-symbols-outlined" style={{ fontSize: 36 }}>verified_user</span>
            <h4 className="font-headline-sm text-headline-sm" style={{ marginTop: 8 }}>Sessões Ativas</h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 24 }}>
            <span className="font-display-lg text-display-lg">{stats.presentToday}</span>
            <span className="font-label-bold text-label-bold">Rastreamento ao Vivo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatMini({ label, value, icon, iconBg, iconColor, valueColor }: {
  label: string; value: string; icon: string;
  iconBg: string; iconColor: string; valueColor: string;
}) {
  return (
    <div style={{
      background: 'var(--surface-container-lowest)',
      borderRadius: 12,
      padding: 16,
      border: '1px solid var(--outline-variant)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,30,64,0.06)',
      flex: 1,
    }}>
      <div>
        <p className="font-label-caps text-label-caps text-on-surface-variant" style={{ marginBottom: 6 }}>{label}</p>
        <h4 className="font-headline-md text-headline-md" style={{ color: valueColor }}>{value}</h4>
      </div>
      <div style={{
        background: iconBg, color: iconColor,
        padding: 12, borderRadius: '50%', display: 'flex',
      }}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
  );
}
