const {api} = require('../../../axios');

export const getTaskById = async (taskId) => {
    try {
        const taskResponse = await api.get(`/api/taskById/${taskId}`);
        return taskResponse.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw new Error(`Failed to fetch task: ${error.message}`);
    }    
}