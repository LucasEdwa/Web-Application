import {api} from '../../axios';

export const getTasks = async (role) => {

  try {
      const taskResponse = await api.get(`/api/get-tasks`);
      console.log('API response:', taskResponse.data); // Log the API response
      return taskResponse.data;
  } catch (error) {
      console.error('Error fetching tasks:', error);
      console.log('Error:', error); // Log the error
      throw new Error('Failed to fetch tasks');
  }    
}