import {api} from '../../axios';
export const getTasks = async () => {
    try {
        
        const taskResponse = await api.get(`/api/get-tasks`);
        return taskResponse.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }    
}
  