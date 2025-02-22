// task list component

import {useState, useEffect} from 'react';
import axios from 'axios';
import TaskItem from './taskitem';
import CreateTask from './createtask';
import { useNavigate } from 'react-router-dom';
import { Task } from '../../types/task.types';

const TaskList = ({updateAuthState}: {updateAuthState: () => void}) => {
  const [tasks, setTasks] = useState<Task[]> ([]);
  const navigate = useNavigate();

  const fetchTasks = async() => {
    try {
      const token = localStorage.getItem('token');
      if(!token){
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/tasks', {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    updateAuthState();
    navigate('/login');
  };

  const handleCreateTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task =>
      task.id === updatedTask.id ? updatedTask:task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return(
    <div className="task-container">
      <div className="task-header">
        <h1>My Tasks</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <CreateTask onTaskCreated={handleCreateTask} />

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="no-tasks">Create your first task!</p>
        ): (
          tasks.map(task => (
            <TaskItem 
              key={task.id}
              task={task}
              onTaskUpdated={handleUpdateTask}
              onTaskDeleted={handleDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;