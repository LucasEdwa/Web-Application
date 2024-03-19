import { api } from '../../axios';

export const uploadPicture = async ({ userImageUrl }) => {

    const formData = new FormData();
    formData.append('userImageUrl', userImageUrl);
    
    const response = await api.post('/api/upload-profile-picture', formData, {
        
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        
    });
    if (response.data.error) {
        throw new Error(response.data.error);
    }
    return response.data;
};
