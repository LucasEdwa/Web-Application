import api from '../../axios';

export const submitTask = async (data) => {
    try {
        console.log('Submitting task with data:', data);
        const response = await api.post(`/api/submit-task`, data);
        return response.data;
    } catch (error) {
        console.error('Error submitting task:', error);
        throw new Error('Failed to submit task');
    }    
}