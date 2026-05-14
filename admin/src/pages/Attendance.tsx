import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function Attendance() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('today');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { loadRecords(); }, [filterPeriod, filterStatus]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*, profiles(full_name, email), locations(name)')
        .order('check_in', { ascending: false })
        .limit(50);
      if (error) throw error;
      setRecords(data || []);
    } catch (error: any) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const isOnTime = (checkIn: string) => {
    const d = new Date(checkIn);
    return d.getHours() * 60 + d.getMinutes() <= 540;
  };

  const formatDate = (s: string) => new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatTime = (s: string) => new Date(s).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const getInitials = (name: string, email: string) =>
    name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
         : email?.charAt(0).toUpperCase() || 'U';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p className="font-body-sm text-body-sm text-on-surface-variant" style={{ marginTop: 16 }}>Carregando histórico...</p>
        </div>
      </div>
    );
  }

  const onTimeCount = records.filter(r => isOnTime(r.check_in)).length;
  const lateCount = records.filter(r => !isOnTime(r.check_in)).length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="font-headline-md text-headline-md text-primary" style={{ marginBottom: 4 }}>Histórico Global de Presença</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Acompanhe todos os registros de ponto dos colaboradores</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'TOTAL DE REGISTROS', value: records.length, icon: 'group', color: 'var(--primary)', bg: 'var(--surface-container)' },
          { label: 'NO HORÁRIO', value: onTimeCount, icon: 'verified', color: 'var(--secondary)', bg: 'rgba(0,108,73,0.1)' },
          { label: 'ATRASOS', value: lateCount, icon: 'schedule', color: 'var(--error)', bg: 'var(--error-container)' },
          { label: 'DURAÇÃO MÉDIA', value: '8.2h', icon: 'avg_pace', color: 'var(--primary)', bg: 'var(--primary-fixed)' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'var(--surface-container-lowest)',
            borderRadius: 12, padding: 16,
            border: '1px solid var(--outline-variant)',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 2px 8px rgba(0,30,64,0.06)',
          }}>
            <div style={{ background: stat.bg, color: stat.color, padding: 10, borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">{stat.label}</p>
              <p className="font-headline-sm text-headline-sm" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Export */}
      <div style={{
        background: 'var(--surface-container-lowest)',
        borderRadius: 12, padding: 16,
        border: '1px solid var(--outline-variant)',
        marginBottom: 24,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
        boxShadow: '0 2px 8px rgba(0,30,64,0.06)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, flex: 1 }}>
          {[
            {
              label: 'Período', type: 'select',
              value: filterPeriod, onChange: setFilterPeriod,
              options: [['today','Hoje'],['yesterday','Ontem'],['week','Últimos 7 dias'],['month','Este mês']] as [string,string][],
            },
            {
              label: 'Status', type: 'select',
              value: filterStatus, onChange: setFilterStatus,
              options: [['all','Todos'],['ontime','No Horário'],['late','Atrasado']] as [string,string][],
            },
          ].map(({ label, value, onChange, options }) => (
            <div key={label}>
              <label className="font-label-bold text-label-bold text-on-surface-variant" style={{ display: 'block', marginBottom: 6 }}>{label}</label>
              <select className="select-arrow" value={value}
                onChange={(e) => onChange(e.target.value)}>
                {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--surface-container-lowest)', color: 'var(--primary)',
            border: '1px solid var(--primary)',
            padding: '10px 16px', borderRadius: 8,
            fontFamily: 'Inter', fontWeight: 600, fontSize: 12, letterSpacing: '0.05em', cursor: 'pointer',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>description</span>
            Exportar CSV
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--primary)', color: 'var(--on-primary)',
            padding: '10px 16px', borderRadius: 8,
            fontFamily: 'Inter', fontWeight: 600, fontSize: 12, letterSpacing: '0.05em', cursor: 'pointer',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>picture_as_pdf</span>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--surface-container-lowest)',
        borderRadius: 12,
        border: '1px solid var(--outline-variant)',
        boxShadow: '0 2px 8px rgba(0,30,64,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-container-low)', borderBottom: '1px solid var(--outline-variant)' }}>
                {['COLABORADOR', 'DATA', 'ENTRADA', 'SAÍDA', 'LOCALIZAÇÃO', 'STATUS', 'AÇÃO'].map(h => (
                  <th key={h} style={{
                    padding: '12px 24px', textAlign: 'left',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                    color: 'var(--on-surface-variant)', fontFamily: 'Inter',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const onTime = isOnTime(record.check_in);
                return (
                  <tr key={record.id}
                    style={{ borderBottom: '1px solid rgba(195,198,209,0.3)', transition: 'background 0.15s', cursor: 'default' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-container-low)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '14px 24px', borderLeft: `4px solid ${onTime ? 'var(--secondary)' : 'var(--error)'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'var(--primary-fixed)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--primary)', fontWeight: 700, fontSize: 12,
                        }}>
                          {getInitials(record.profiles?.full_name, record.profiles?.email)}
                        </div>
                        <div>
                          <p className="font-label-bold text-label-bold text-on-surface">{record.profiles?.full_name || 'Usuário'}</p>
                          <p style={{ fontSize: 10, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {record.profiles?.email || ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{formatDate(record.check_in)}</span>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span className="font-body-sm text-body-sm text-primary" style={{ fontWeight: 700 }}>{formatTime(record.check_in)}</span>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span className="font-body-sm text-body-sm text-primary" style={{ fontWeight: 700 }}>
                        {record.check_out ? formatTime(record.check_out) : '--:--'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>
                          {record.locations ? 'location_on' : 'location_off'}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {record.locations?.name || 'Não informado'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      {onTime ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          background: 'rgba(0,108,73,0.1)', color: 'var(--secondary)',
                          border: '1px solid rgba(0,108,73,0.2)',
                          padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          No Raio
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          background: 'var(--error-container)', color: 'var(--error)',
                          border: '1px solid rgba(186,26,26,0.2)',
                          padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>warning</span>
                          Atrasado
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <button style={{
                        padding: 4, background: 'transparent', cursor: 'pointer',
                        color: 'var(--on-surface-variant)', display: 'flex', borderRadius: 4,
                        transition: 'color 0.15s',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--on-surface-variant)')}>
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {records.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>history</span>
            <p className="font-body-md text-body-md text-on-surface-variant" style={{ fontWeight: 600 }}>Nenhum registro encontrado</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant" style={{ marginTop: 4 }}>Os registros de ponto aparecerão aqui</p>
          </div>
        )}

        {/* Pagination */}
        {records.length > 0 && (
          <div style={{
            background: 'var(--surface-container-low)',
            padding: '12px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderTop: '1px solid var(--outline-variant)',
          }}>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Exibindo 1 a {records.length} de {records.length} registros
            </span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <button style={{
                padding: 4, border: '1px solid var(--outline-variant)',
                background: 'var(--surface-container-lowest)', borderRadius: 4,
                color: 'var(--on-surface-variant)', opacity: 0.5, cursor: 'default', display: 'flex',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
              </button>
              <button style={{
                width: 32, height: 32, border: 'none',
                background: 'var(--primary)', color: 'var(--on-primary)',
                borderRadius: 4, fontFamily: 'Inter', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}>1</button>
              <button style={{
                padding: 4, border: '1px solid var(--outline-variant)',
                background: 'var(--surface-container-lowest)', borderRadius: 4,
                color: 'var(--on-surface-variant)', opacity: 0.5, cursor: 'default', display: 'flex',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
