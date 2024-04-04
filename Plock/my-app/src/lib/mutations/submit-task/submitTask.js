import {api} from '../../axios';

export const submitTask = async (answers) => {
    const response = await api.post('http://localhost:4000/api/submit-task', answers);
    return response.data;
};