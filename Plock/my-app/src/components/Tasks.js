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
        queryFn: ()=> getTasks(),
    });

    console.log('Tasks:', tasks); // log the tasks data to the console

    
    if (isUserLoading || isTasksLoading) {
        return(  <div className="text-center h-screen w-screen flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold">Loading...</h2>
                </div>
        );
    }
    
    
    if (isUserError || isTasksError || !user || !tasks) {
        return <div className="text-center h-screen w-screen flex flex-col justify-center">
        <h2 className="text-2xl font-semibold">Error loading tasks</h2>
    </div>;
    }

    return (
        <div className="h-creen">{
            
            tasks.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2  lg:grid-cols-4 p-14">
                    {tasks.map(task => (
                        <Task key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                <>
                <div className="text-center h-screen w-screen flex flex-col justify-center">
                    
                    <h2 className="text-2xl font-semibold">No tasks available</h2>
                    <p className="text-lg">Please check back later</p>
                </div>
                </>
            )}
        </div>
    );}

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