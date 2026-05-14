import { useState, useEffect } from 'react';
import { getAttendanceRecords } from '../services/supabase';
import Papa from 'papaparse';

export default function Attendance() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', userId: '' });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await getAttendanceRecords(filters);
      setRecords(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = records.map(record => ({
      ID: record.id,
      Usuario: record.profiles?.name || record.user_id,
      Email: record.profiles?.email || '',
      Local: record.locations?.name || '',
      'Check-in': new Date(record.check_in).toLocaleString('pt-BR'),
      'Check-out': record.check_out ? new Date(record.check_out).toLocaleString('pt-BR') : '-',
      'Distância': record.distance_meters ? `${record.distance_meters}m` : '-',
      'Data': new Date(record.check_in).toLocaleDateString('pt-BR'),
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `registros_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleClearFilters = () => {
    setFilters({ startDate: '', endDate: '', userId: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-medium mt-4">Carregando registros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Registros de Presença</h1>
            <p className="text-on-surface-variant">Acompanhe todos os registros de ponto</p>
          </div>
          <button
            onClick={handleExport}
            className="btn-primary hidden md:flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar CSV
          </button>
        </div>
        <button
          onClick={handleExport}
          className="btn-primary md:hidden mt-4 w-full"
        >
          Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Data Inicial</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Data Final</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">ID do Usuário</label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              className="w-full"
              placeholder="Opcional"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={loadRecords} className="btn-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Filtrar
          </button>
          <button onClick={handleClearFilters} className="btn-secondary">
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Usuário</th>
                <th className="text-left hidden md:table-cell">Local</th>
                <th className="text-left">Check-in</th>
                <th className="text-left hidden md:table-cell">Check-out</th>
                <th className="text-left hidden md:table-cell">Distância</th>
                <th className="text-left">Data</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div>
                      <div className="font-semibold text-primary">{record.profiles?.name || 'N/A'}</div>
                      <div className="text-sm text-on-surface-variant">{record.profiles?.email || ''}</div>
                    </div>
                  </td>
                  <td className="text-on-surface-variant hidden md:table-cell">{record.locations?.name || '-'}</td>
                  <td className="text-on-surface font-medium">
                    {new Date(record.check_in).toLocaleString('pt-BR')}
                  </td>
                  <td className="text-on-surface-variant hidden md:table-cell">
                    {record.check_out ? (
                      new Date(record.check_out).toLocaleString('pt-BR')
                    ) : (
                      <span className="text-outline-variant">-</span>
                    )}
                  </td>
                  <td className="hidden md:table-cell">
                    {record.distance_meters ? (
                      <span className="badge badge-blue">{record.distance_meters}m</span>
                    ) : (
                      <span className="text-outline-variant">-</span>
                    )}
                  </td>
                  <td className="text-on-surface-variant text-sm">
                    {new Date(record.check_in).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {records.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-outline-variant mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-on-surface-variant font-medium">Nenhum registro encontrado</p>
            <p className="text-on-surface-variant text-sm mt-1">Use os filtros para buscar registros específicos</p>
          </div>
        )}
      </div>
    </div>
  );
}
