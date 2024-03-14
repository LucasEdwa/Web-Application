import api from '../../axios';

export async function PostSignIn({ email, password }) {
    try {
      const response = await api.post('/api/sign-in', { email, password });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw error;
      }
    }
  }