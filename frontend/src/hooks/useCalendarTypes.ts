import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api';
import type { CalendarType } from '../types/Calendar';

export const useCalendarTypes = () => {
  return useQuery({
    queryKey: ['calendarTypes'],
    queryFn: async () => {
      const response = await apiClient.get<CalendarType[]>('/calendar/types');
      return response.data;
    },
    staleTime: Infinity,
  });
};