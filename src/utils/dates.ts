import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDate = (value: string, format = 'DD MMM YYYY') =>
  dayjs(value).format(format);

export const fromNow = (value: string) => dayjs(value).fromNow();

export const daysBetween = (from: string, to: string) => dayjs(to).diff(dayjs(from), 'day');

export const deadlineBadge = (deadline: string) => {
  const diff = dayjs(deadline).diff(dayjs(), 'day');
  if (diff < 0) return { label: `${Math.abs(diff)}d atraso`, tone: 'danger' };
  if (diff <= 2) return { label: `Faltan ${diff}d`, tone: 'warning' };
  return { label: `Faltan ${diff}d`, tone: 'success' };
};

export const trafficLight = (deadline: string, status: string) => {
  if (status === 'completed') return 'green';
  const diff = dayjs(deadline).diff(dayjs(), 'day');
  if (diff < 0) return 'red';
  if (diff <= 7) return 'yellow';
  return 'green';
};
