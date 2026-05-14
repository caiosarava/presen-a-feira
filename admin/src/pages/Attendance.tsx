import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function Attendance() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('today');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadRecords();
  }, [filterPeriod, filterStatus]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const { data: recordsData, error } = await supabase
        .from('attendance_records')
        .select('*, profiles(full_name, email), locations(name)')
        .order('check_in', { ascending: false })
        .limit(50);

      if (error) throw error;
      setRecords(recordsData || []);
    } catch (error: any) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (checkIn: string) => {
    const checkInDate = new Date(checkIn);
    const hour = checkInDate.getHours();
    const minutes = checkInDate.getMinutes();
    const checkInTime = hour * 60 + minutes;
    
    // 9:00 AM = 540 minutes
    if (checkInTime > 540) {
      return { label: 'Atrasado', class: 'bg-error-container text-error', icon: 'warning' };
    }
    return { label: 'No Horário', class: 'bg-secondary/10 text-secondary', icon: 'check_circle' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-medium mt-4">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: records.length,
    onTime: records.filter(r => {
      const checkInDate = new Date(r.check_in);
      const hour = checkInDate.getHours();
      const minutes = checkInDate.getMinutes();
      return hour * 60 + minutes <= 540;
    }).length,
    late: records.filter(r => {
      const checkInDate = new Date(r.check_in);
      const hour = checkInDate.getHours();
      const minutes = checkInDate.getMinutes();
      return hour * 60 + minutes > 540;
    }).length,
    avgDuration: '8.2h'
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Histórico de Registros</h1>
        <p className="text-on-surface-variant">Acompanhe todos os registros de ponto dos colaboradores</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-2.02M21 21v-2a3 3 0 00-3-3h-1m-15 0a3 3 0 00-5.356 2.02M3 21v-2a3 3 0 003-3h1" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase">Total de Registros</p>
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase">No Horário</p>
            <p className="text-2xl font-bold text-secondary">{stats.onTime}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center text-error">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase">Atrasos</p>
            <p className="text-2xl font-bold text-error">{stats.late}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-tertiary-container/10 rounded-full flex items-center justify-center text-tertiary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase">Duração Média</p>
            <p className="text-2xl font-bold text-primary">{stats.avgDuration}</p>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-2">Período</label>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="min-w-[150px]"
              >
                <option value="today">Hoje</option>
                <option value="yesterday">Ontem</option>
                <option value="week">Últimos 7 dias</option>
                <option value="month">Este mês</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="min-w-[150px]"
              >
                <option value="all">Todos</option>
                <option value="ontime">No Horário</option>
                <option value="late">Atrasado</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-surface-container-lowest border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6M21 10a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Exportar CSV
            </button>
            <button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container">
                <th className="text-left px-6 py-4">Colaborador</th>
                <th className="text-left px-6 py-4">Data</th>
                <th className="text-left px-6 py-4">Entrada</th>
                <th className="text-left px-6 py-4">Saída</th>
                <th className="text-left px-6 py-4">Local</th>
                <th className="text-left px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {records.map((record) => {
                const status = getStatusBadge(record.check_in);
                return (
                  <tr key={record.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
                          {record.profiles?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface">{record.profiles?.full_name || 'Usuário'}</p>
                          <p className="text-xs text-on-surface-variant">{record.profiles?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {formatDate(record.check_in)}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      {formatTime(record.check_in)}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      {record.check_out ? formatTime(record.check_out) : '--:--'}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-outline-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{record.locations?.name || 'Não informado'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${status.class}`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          {status.icon === 'check_circle' ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.003-1.742 3.003H5.72c-1.529 0-2.493-1.667-1.743-3.003l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          )}
                        </svg>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {records.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-outline-variant mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-on-surface-variant font-medium">Nenhum registro encontrado</p>
            <p className="text-on-surface-variant text-sm mt-1">Os registros de ponto aparecerão aqui</p>
          </div>
        )}
      </div>
    </div>
  );
}
