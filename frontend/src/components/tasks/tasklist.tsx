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
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <h1 style={{ color: 'var(--primary)' }}>Task Manager</h1>
        <button 
          className="btn btn-danger" 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="card mb-4">
        <h2 className="mb-4" style={{ color: 'var(--primary)' }}>Create Task</h2>
        <CreateTask onTaskCreated={handleCreateTask} />
      </div>
      
      <div className="card">
        <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>My Tasks</h2>
        
        {tasks.length === 0 ? (
          <div className="text-center" style={{ padding: '30px 0', color: 'var(--text-light)' }}>
            <p>You don't have any tasks yet. Create your first task above!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {tasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onTaskUpdated={handleUpdateTask}
                onTaskDeleted={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;