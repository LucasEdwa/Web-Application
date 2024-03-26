import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTaskById } from '../../lib/queries/get-task/[id]/getTaskById';
import { getUser } from '../../lib/queries/get-current-user/getUser';
import { submitTask } from '../../lib/mutations/submit-task/submitTask';
import { useParams } from 'react-router-dom'

const TaskPage = () => {
    const [userAnswers, setUserAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery({
        queryKey:['user'], queryFn: getUser});

    const { id: taskId } = useParams();
    const taskIdNumber = Number(taskId);

    const { data: task, isLoading: isTaskLoading, isError: isTaskError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => isNaN(taskIdNumber) ? Promise.reject(new Error('Invalid task ID')) : getTaskById(taskIdNumber),
        enabled: taskId !== null
    });
    const mutation = useMutation({
        mutationFn:(data) => submitTask(data),
        onSuccess: () => {
            console.log('Task submitted successfully');
        },
        onError: (error) => {
            console.error('Failed to submit task:', error);
        }}
    );

    const handleAnswerChange = (optionIndex) => {
        setUserAnswers(prev => {
            prev[currentQuestionIndex] = optionIndex;
            return [...prev];
        });
        if (task.questions[currentQuestionIndex].options[optionIndex].isCorrect) {
            setCorrectAnswers(prev => prev + 1);
        }
        else {
            setCorrectAnswers(prev => prev - 1);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!user) {
            console.error('User is undefined');
            return;
        }
        if (currentQuestionIndex < task.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } 
        else {
            const questionId = task.questions[currentQuestionIndex].id;
            const optionId = userAnswers[currentQuestionIndex];
            mutation.mutate({ userId: user.id, questionId, optionId, taskId });
        }
    };
    
    if (isUserLoading || isTaskLoading || isUserError || isTaskError || !task) {
        return <div className="h-screen text-center mt-8">Loading...</div>;
    }

    const currentQuestion = task.questions[currentQuestionIndex];

    return (
        <div className="plock-body flex justify-center bg-slate-700 text-white h-screen">
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
                    <button type="submit" className="bg-slate-950 p-2 w-[8rem] rounded-full">
                        {currentQuestionIndex === task.questions.length - 1 ? 'Submit' : 'Next'}
                    </button>
                </ul>
                </form>
            </div>

            ) : (
               <>
                <div>
                    <h1>Task Completed!</h1>
                </div>
                 <div>
                 <h1>Task Completed!</h1>
                 <p>You answered {correctAnswers} questions correctly.</p>
             </div>
               </>
            )}
        </div>
    );
};

export default TaskPage;