import Tasks from '../../components/Tasks';



export default function TasksPage() {
    return (
        <div className="tasks-done h-screen w-screen">
            
            <div className="tasks flex">
                <Tasks />
            </div>
        </div>
    );
}