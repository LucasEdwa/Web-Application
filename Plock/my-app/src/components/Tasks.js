import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../lib/queries/get-tasks/getTasks";
import { getUser } from "../lib/queries/get-current-user/getUser";

function Tasks() {
    const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery({
        queryKey:['user'],
        queryFn: getUser
    });
    
    const { data: tasks, isLoading: isTasksLoading, isError: isTasksError } = useQuery({
        queryKey: ['tasks'],
        queryFn: getTasks,
    });
    if (isUserLoading || isTasksLoading) {
        return <div>Loading...</div>;
    }

    if (isUserError || isTasksError || !user || !tasks) {
        return <div>Error loading tasks</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-4">Tasks</h1>
            <div className="grid grid-cols-5 gap-6">
                {tasks?.map((task, index) => (

                    <Task task={task} key={index} />
                ))}
            </div>
        </div>
    );
}

function Task({ task }) {
    return (
        <div className="flex flex-col justify-between gap-4 p-4 bg-gray-300 rounded-xl">
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p>{task.description}</p>
            {/* Additional task details */}
            <Link to={`/tasks/${task.id}`} className="text-blue-500">View task</Link>
        </div>
    );
}

export default Tasks;