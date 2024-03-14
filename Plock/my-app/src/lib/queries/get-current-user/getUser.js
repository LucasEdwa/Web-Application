import { api} from '../../axios';

export const  getUser = async () =>{

    try {
        const response = await api.get('/api/current-user', {
        
            headers: {"x-access-token": localStorage.getItem("token")}
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Failed to fetch user data');
    }    

};