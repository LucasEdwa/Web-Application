import React, { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTaskById } from '../../lib/queries/get-task/[id]/getTaskById';
import { getUser } from '../../lib/queries/get-current-user/getUser';
import { submitTask } from '../../lib/mutations/submit-task/submitTask';
import { useParams, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskPage = () => {
    const [userAnswers, setUserAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const navigate = useNavigate();

    const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery({
        queryKey:['user'], queryFn: getUser},
    );
    const { id: taskId } = useParams();
    const taskIdNumber = Number(taskId);

    const { data: task, isLoading: isTaskLoading, isError: isTaskError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => isNaN(taskIdNumber) ? Promise.reject(new Error('Invalid task ID')) : getTaskById(taskIdNumber),
        enabled: taskId !== null
    });

    const mutation = useMutation({
        mutationFn:(data) => submitTask(data),
       
    });
    
const handleAnswerChange = useCallback((optionIndex) => {
    setUserAnswers(prev => {
        const prevAnswers = [...prev];
        const prevAnswer = prevAnswers[currentQuestionIndex];
        const isPrevAnswerCorrect = task.questions[currentQuestionIndex].options[prevAnswer]?.isCorrect;
        const isCurrentAnswerCorrect = task.questions[currentQuestionIndex].options[optionIndex].isCorrect;

        prevAnswers[currentQuestionIndex] = optionIndex;

        if (isPrevAnswerCorrect && !isCurrentAnswerCorrect) {
            setCorrectAnswers(prev => prev - 1);
        } else if (!isPrevAnswerCorrect && isCurrentAnswerCorrect) {
            setCorrectAnswers(prev => prev + 1);
        }

        return prevAnswers;
    });
}, [currentQuestionIndex, task]);

const handleSubmit = useCallback((event) => {
    event.preventDefault();
   
    const questionId = task.questions[currentQuestionIndex].id;
    const selectedOptionIndex = userAnswers[currentQuestionIndex];
    const optionId = task.questions[currentQuestionIndex].options[selectedOptionIndex].id;

    if (user.user && user.user.id) { // Check if user and user.id is not undefined
        mutation.mutate({ userId: user.user.id, questionId, optionId,  taskId: Number(taskId)  });
    } else {
        console.error('User or user ID is undefined');
    }        

    if (currentQuestionIndex < task.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
        // Wait for the last mutation to complete before navigating
        mutation.mutate({ userId: user.user.id, questionId, optionId,  taskId: Number(taskId)  }, {
            onSuccess: () => {
                if (mutation.isSuccess) {
                    toast.success('Task submitted successfully!');
                }
                navigate('/tasks-page');
                
            },
            onError: (error) => {
                console.error('Failed to submit task:', error);
            }
        });
            
    }

}, [currentQuestionIndex, task, user, userAnswers, mutation, navigate]);

    if (isUserLoading || isTaskLoading || isUserError || isTaskError || !task) {
        return <div className="h-screen text-center mt-8">Loading...</div>;
    }

    const currentQuestion = task.questions[currentQuestionIndex];

    return (
        <div className="plock-body flex justify-center bg-slate-700 text-white h-screen">
            <ToastContainer />

            {currentQuestion ? (
                <div className="m-[2rem] p-6">
                <form className="bg-blue-900 form p-[8rem] rounded-3xl" onSubmit={handleSubmit}>
                    <div className="w-[39rem]">
                        <p>{currentQuestionIndex + 1}. {currentQuestion.question}</p>
                    </div>
                    <ul className="flex flex-col gap-6 w-[39rem]">
                        {currentQuestion.options.map((option, optionIndex) => (
                            <li key={optionIndex} className="mt-10 w-full">
                                <input
                                    className="left-0"
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
                        
                    <button type="submit" disabled={false} className="bg-slate-950 p-2 w-[8rem] rounded-full">
                        {currentQuestionIndex === task.questions.length - 1 ? 'Submit' : 'Next'}
                    </button>
                </ul>
                </form>
            </div>

            ) : (
               <div>
                 <h1>Task Completed!</h1>
                 <p>You answered {correctAnswers} questions correctly.</p>
               </div>
            )}
        </div>
    );
};

export default TaskPage;