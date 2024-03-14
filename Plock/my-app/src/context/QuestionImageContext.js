import React, { createContext, useReducer } from 'react';

export const QuestionImageContext = createContext();

const initialState = {
    questionImage: null,
    loading: false,
    error: null,
    cache: {},
};

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_IMAGE':
            return { ...state, loading: true };
        case 'SET_IMAGE':
            return { ...state, questionImage: action.payload, cache: { ...state.cache, [action.questionId]: action.payload }, loading: false };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_CACHED_IMAGE':
            return { ...state, questionImage: state.cache[action.questionId] };
        default:
            throw new Error();
    }
}

export const QuestionImageProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchQuestionImage = async (questionId) => {
        if (state.cache[questionId]) {
            dispatch({ type: 'SET_CACHED_IMAGE', questionId });
            return;
        }

        dispatch({ type: 'FETCH_IMAGE' });
        try {
            const response = await fetch(`/api/get-question-image/${questionId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const image = await response.json();
            dispatch({ type: 'SET_IMAGE', payload: image, questionId });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    return (
        <QuestionImageContext.Provider value={{ ...state, fetchQuestionImage }}>
            {children}
        </QuestionImageContext.Provider>
    );
};