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
          <p className="text-gray-600 font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de presença</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total de Usuários" 
          value={stats.totalUsers} 
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard 
          title="Presentes Hoje" 
          value={stats.presentToday} 
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          gradient="from-green-500 to-green-600"
          highlight
        />
        <StatCard 
          title="Locais Cadastrados" 
          value={stats.totalLocations} 
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          gradient="from-purple-500 to-purple-600"
        />
        <StatCard 
          title="Registros Hoje" 
          value={stats.recordsToday} 
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Summary Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Resumo do Dia</h2>
            <p className="text-gray-600">Acompanhamento diário de presenças</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-700 mb-1">{stats.presentToday}</div>
            <div className="text-sm text-green-700 font-medium">Usuários presentes</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-700 mb-1">{stats.recordsToday}</div>
            <div className="text-sm text-blue-700 font-medium">Registros hoje</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-700 mb-1">{stats.totalLocations}</div>
            <div className="text-sm text-purple-700 font-medium">Locais ativos</div>
          </div>
        </div>

        <p className="text-gray-600 mt-6 pt-6 border-t border-gray-100">
          <span className="font-semibold text-green-700">{stats.presentToday}</span> usuários presentes hoje, 
          totalizando <span className="font-semibold text-green-700">{stats.recordsToday}</span> registros de ponto.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient, highlight = false }: any) {
  return (
    <div className={`card ${highlight ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}>
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg text-white flex-shrink-0`}>
          <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8">
            {icon}
          </div>
        </div>
        {highlight && (
          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap">
            Atualizado
          </span>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs sm:text-sm text-gray-600 font-medium line-clamp-2">{title}</div>
    </div>
  );
}
