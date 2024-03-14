import Tasks from '../../components/Tasks';



export default function TasksPage() {
    return (
        <div className="tasks-done h-screen">
            
            <div className="tasks flex flex-row flex-wrap">
                <Tasks />
            </div>
        </div>
    );
}