import { useAuth } from '@/contexts/AuthContext';
import { ClinicApiService } from '@/lib/api';

export function useActivityLogger() {
  const { user } = useAuth();

  const logActivity = async (
    action: string,
    resource: string,
    resourceId?: number,
    details?: string
  ) => {
    if (!user) return;

    try {
      await ClinicApiService.logActivity(action, resource, resourceId, details);
    } catch (error) {
      // Don't throw error for activity logging to avoid disrupting user experience
      console.error('Failed to log activity:', error);
    }
  };

  return { logActivity };
}
