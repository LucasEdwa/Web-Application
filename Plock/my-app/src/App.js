import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Authantication/SignUp';
import Signin from './pages/Authantication/SignIn';
import Footer from './components/Footer';
import TasksPage from './pages/Tasks/TasksPage';
import Task from './pages/Tasks/Task';
import Tasks from './components/Tasks';
import UserPage from './pages/UserPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//import ScorePanel from './components/ScorePanel';
/** Hre i use router-dom to make routes to my pages
 * added QueryClientProvider to provide the queryClient to the rest of the app
 */
const queryClient = new QueryClient();

function App() {
  return (
    <main className="app ">
      <QueryClientProvider client={queryClient}>
    
         <Navbar />
        <Routes>
          <Route path="/" element={<><Home /></>} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/tasks-page" element={<TasksPage />} />
          <Route path="/tasks/:id" element={<Task />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/user-page" element={<UserPage />} />

        </Routes>
        <Footer />
      </QueryClientProvider>

    </main>

  );
}

export default App;
