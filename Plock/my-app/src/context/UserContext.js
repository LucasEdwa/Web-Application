import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [userImageUrl, setUserImageUrl] = useState('https://via.placeholder.com/150');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await axiosInstance.get('/current-user', {
                    headers: {"x-access-token": token}
                });
                setUser(response.data.user);
                setUserImageUrl(response.data.user.userImageUrl || 'https://via.placeholder.com/150');
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data');
            }
        }
    }, []);

    const uploadImage = async (file) => {
        if (!file) {
            setError("No file selected for upload.");
            return;
        }

        const formData = new FormData();
        formData.append("userImageUrl", file); // Match the field expected by the server

        const token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await axiosInstance.post("/api/upload-profile-picture", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "x-access-token": token,
                    },
                });
                if (response.data.success) {
                    setSuccess("Profile picture uploaded successfully.");
                    fetchUser(); // Refresh user data
                } else {
                    setError(response.data.error || "Failed to upload image.");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                setError("Failed to upload image.");
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const contextValue = {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        userImageUrl,
        setUserImageUrl,
        success,
        setSuccess,
        error,
        setError,
        uploadImage,
    };

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
