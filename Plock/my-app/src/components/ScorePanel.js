import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const ScorePanel = () => {
    const { user } = useContext(UserContext);

    // If user is null, render a loading message or nothing
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="score-panel">
            <h2>{user.fullName}'s Score</h2>
            <p>Total Missions Completed: {user.totalMissionsCompleted}</p>
            <p>Score: {user.score}</p>
        </div>
    );
}

export default React.memo(ScorePanel);