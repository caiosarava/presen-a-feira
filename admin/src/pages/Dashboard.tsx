import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface Stats {
  totalUsers: number;
  presentToday: number;
  totalLocations: number;
  recordsToday: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, presentToday: 0, totalLocations: 0, recordsToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-medium mt-4">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-on-surface-variant">Visão geral do sistema de presença</p>
      </div>

      {/* Stats Grid - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total de Usuários" 
          value={stats.totalUsers} 
          icon={
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          gradient="from-primary to-primary-container"
        />
        <StatCard 
          title="Presentes Hoje" 
          value={stats.presentToday} 
          icon={
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          gradient="from-secondary to-green-700"
          highlight
        />
        <StatCard 
          title="Locais Cadastrados" 
          value={stats.totalLocations} 
          icon={
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          gradient="from-tertiary-container to-tertiary"
        />
        <StatCard 
          title="Registros Hoje" 
          value={stats.recordsToday} 
          icon={
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Summary Card */}
      <div className="card mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">Resumo do Dia</h2>
            <p className="text-on-surface-variant">Acompanhamento diário de presenças</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-secondary to-green-700 rounded-xl flex items-center justify-center shadow-lg text-on-secondary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="text-3xl font-bold text-secondary mb-1">{stats.presentToday}</div>
            <div className="text-sm text-green-800 font-semibold">Usuários presentes</div>
          </div>
          <div className="bg-gradient-to-br from-primary-fixed/30 to-primary-fixed/10 rounded-xl p-6 border border-primary-fixed">
            <div className="text-3xl font-bold text-primary mb-1">{stats.recordsToday}</div>
            <div className="text-sm text-primary font-semibold">Registros hoje</div>
          </div>
          <div className="bg-gradient-to-br from-tertiary-fixed/30 to-tertiary-fixed/10 rounded-xl p-6 border border-tertiary-fixed">
            <div className="text-3xl font-bold text-tertiary mb-1">{stats.totalLocations}</div>
            <div className="text-sm text-tertiary font-semibold">Locais ativos</div>
          </div>
        </div>

        <p className="text-on-surface-variant mt-6 pt-6 border-t border-outline-variant">
          <span className="font-semibold text-secondary">{stats.presentToday}</span> usuários presentes hoje, 
          totalizando <span className="font-semibold text-secondary">{stats.recordsToday}</span> registros de ponto.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient, highlight = false }: any) {
  return (
    <div className={`card ${highlight ? 'ring-2 ring-secondary ring-offset-2' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg text-on-primary`}>
          {icon}
        </div>
        {highlight && (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Atualizado
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-primary mb-1">{value}</div>
      <div className="text-sm text-on-surface-variant font-medium">{title}</div>
    </div>
  );
}
