import { useState, useEffect } from 'react';
import { getAttendanceRecords } from '../services/supabase';
import Papa from 'papaparse';
import type { AttendanceRecord } from '../types';

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
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
      CheckIn: new Date(record.check_in).toLocaleString('pt-BR'),
      CheckOut: record.check_out ? new Date(record.check_out).toLocaleString('pt-BR') : '-',
      Distancia: record.distance_meters ? `${record.distance_meters}m` : '-',
      Data: new Date(record.check_in).toLocaleDateString('pt-BR'),
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

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Registros de Presenca</h1>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Exportar CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data Inicial</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data Final</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Usuario ID</label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="Opcional"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadRecords}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Filtrar
          </button>
          <button
            onClick={handleClearFilters}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distancia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{record.profiles?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{record.profiles?.email || ''}</div>
                  </div>
                </td>
                <td className="px-6 py-4">{record.locations?.name || '-'}</td>
                <td className="px-6 py-4">
                  {new Date(record.check_in).toLocaleString('pt-BR')}
                </td>
                <td className="px-6 py-4">
                  {record.check_out ? new Date(record.check_out).toLocaleString('pt-BR') : '-'}
                </td>
                <td className="px-6 py-4">{record.distance_meters ? `${record.distance_meters}m` : '-'}</td>
                <td className="px-6 py-4">
                  {new Date(record.check_in).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <div className="p-8 text-center text-gray-500">Nenhum registro encontrado</div>
        )}
      </div>
    </div>
  );
}
