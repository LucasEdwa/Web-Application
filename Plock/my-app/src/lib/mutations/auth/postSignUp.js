import api from '../../axios';

export async function PostSignUp({ email, password, fullName, role}) {
    try {
      const response = await api.post('/api/sign-up', { email, password, fullName, role});
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw error;
      }
    }
}