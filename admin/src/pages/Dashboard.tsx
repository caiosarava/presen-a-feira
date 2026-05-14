import React, { useState, useEffect } from 'react';
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

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total de Usuarios" value={stats.totalUsers} color="bg-blue-500" />
        <StatCard title="Presentes Hoje" value={stats.presentToday} color="bg-green-500" />
        <StatCard title="Locais Cadastrados" value={stats.totalLocations} color="bg-purple-500" />
        <StatCard title="Registros Hoje" value={stats.recordsToday} color="bg-orange-500" />
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Resumo do Dia</h2>
        <p className="text-gray-600">
          {stats.presentToday} usuarios presentes hoje, totalizando {stats.recordsToday} registros de ponto.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`w-12 h-12 ${color} rounded-lg mb-4 flex items-center justify-center`}>
        <span className="text-white text-2xl">{value}</span>
      </div>
      <h3 className="text-gray-600 text-sm">{title}</h3>
    </div>
  );
}
