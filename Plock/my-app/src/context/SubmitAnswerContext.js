import { createContext } from 'react';

export const SubmitAnswerContext = createContext();

const BASE_URL = 'http://localhost:4000';

const submitAnswer = async (userId, taskId, questionId, optionId) => {
    const response = await fetch(`${BASE_URL}/api/submit-answer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
            userId,
            taskId,
            questionId,
            optionId,
        })
    });
    
    if (!response.ok) {
        throw new Error(`Server responded with status code ${response.status}`);
    }

    return response.json(); // Return response data
};

export const SubmitAnswerProvider = ({ children }) => {
    return (
        <SubmitAnswerContext.Provider value={submitAnswer}>
            {children}
        </SubmitAnswerContext.Provider>
    );
};