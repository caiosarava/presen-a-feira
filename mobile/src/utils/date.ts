import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
}

export function formatTime(dateString: string): string {
  return format(parseISO(dateString), 'HH:mm', { locale: ptBR });
}

export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), "dd 'de' MMMM 's' HH:mm", { locale: ptBR });
}

export function formatRelativeDate(dateString: string): string {
  const date = parseISO(dateString);
  if (isToday(date)) return `Hoje s ${formatTime(dateString)}`;
  if (isYesterday(date)) return `Ontem s ${formatTime(dateString)}`;
  return formatDate(dateString);
}
