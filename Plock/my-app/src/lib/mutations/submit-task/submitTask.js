import {api} from '../../axios';

export const submitTask = async (data) => {
    try {
        const response = await api.post(`/api/submit-task`, data);
        return response.data;
    } catch (error) {
        console.error('Error submitting task:', error);
        throw new Error('Failed to submit task');
    }    
}