import { api } from '../../axios';

export async function getUser() {
    try {
        const response = await api.get('/api/current-user');
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 500) {
            throw new Error('Server error. Please try again later.');
        } else {
            throw error;
        }
    }
}