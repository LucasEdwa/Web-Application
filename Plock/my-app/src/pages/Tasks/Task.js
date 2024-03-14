import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTasks } from '../../lib/queries/get-tasks/[role]/getTasks';
import { getUser } from '../../lib/queries/get-current-user/getUser';
import { submitTask } from '../../lib/mutations/submit-task/submitTask';

const TaskPage = () => {
    const [userAnswers, setUserAnswers] = useState([]);
    const [taskId, setTaskId] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const { data: user, isLoading: isUserLoading } = useQuery('user', getUser);
    const role = user?.role;

    const { data: task, isSuccess: isTaskLoading } = useQuery( {queryKey: ['task'], queryFn:() => getTasks(role)}, {
        onSuccess: (data) => {
            setTaskId(data.id);
        }
    });
    
    const mutation = useMutation(submitTask, {
        onSuccess: () => {
            console.log('Task submitted successfully');
        },
        onError: (error) => {
            console.error('Failed to submit task:', error);
        }
    });

    const handleAnswerChange = (optionIndex) => {
        setUserAnswers(prev => {
            prev[currentQuestionIndex] = optionIndex;
            return [...prev];
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (currentQuestionIndex < task.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            mutation.mutate({ taskId, answers: userAnswers });
        }
    };

    if (isUserLoading || isTaskLoading) {
        return <div>Loading...</div>;
    }

    const currentQuestion = task.questions[currentQuestionIndex];

    return (
        <div className="plock-body flex justify-center bg-slate-700 text-white h-screen">
            {currentQuestion ? (
                <div>
                    <form onSubmit={handleSubmit}>
                        <p>{currentQuestionIndex + 1}. {currentQuestion.question}</p>
                        <ul className="flex flex-col gap-6">
                            {currentQuestion.options.map((option, optionIndex) => (
                                <li key={optionIndex}>
                                    <input
                                        type="radio"
                                        id={`question_option${optionIndex}`}
                                        name="question"
                                        value={optionIndex}
                                        onChange={() => handleAnswerChange(optionIndex)}
                                        checked={userAnswers[currentQuestionIndex] === optionIndex}
                                    />
                                    <label htmlFor={`question_option${optionIndex}`}>
                                        {String.fromCharCode(65 + optionIndex)}. {option.text}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </form>
                </div>
            ) : (
                <div>
                    <h1>Task Completed!</h1>
                </div>
            )}
        </div>
    );
};

export default TaskPage;