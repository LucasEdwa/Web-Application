import {api} from '../../axios';

export const getBanner = async (ids) => {
    try {
        const responses = await Promise.all(ids.map(id => api.get(`/api/get-banner-image/${id}`)));
        return responses.map(response => response.data);
    } catch (error) {
        console.error('Error fetching banner data:', error);
        throw new Error('Failed to fetch banner data');
    }    
}