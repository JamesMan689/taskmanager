// task item component inside task list

import { useState } from "react";
import axios from "axios";
import {Task, UpdateTaskInput} from '../../types/task.types';

interface TaskItemProps{
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

const TaskItem =({task, onTaskUpdated, onTaskDeleted}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isComplete, setIsComplete] = useState(task.isComplete);
  
  const handleUpdate = async(updateData: UpdateTaskInput) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/tasks/${task.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      onTaskUpdated(response.data);
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleDelete = async() => {
    if(!confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/tasks/${task.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onTaskDeleted(task.id);
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  const handleCompleteToggle =() => {
    const toggleComplete = !isComplete;
    setIsComplete(toggleComplete);
    handleUpdate({ isComplete: toggleComplete });
  };

  const handleSaveUpdate = () => {
    handleUpdate( {title, description });
    setIsEditing(false);
  };

  return (
    <div className={`card ${isComplete ? 'completed' : ''}`} style={{ 
      borderLeft: isComplete ? '4px solid var(--success)' : '4px solid var(--primary)',
      transition: 'all 0.3s ease',
      opacity: isComplete ? 0.8 : 1
    }}>
      
      {isEditing ? (
        <div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSaveUpdate}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isComplete}
                onChange={handleCompleteToggle}
                style={{ width: '20px', height: '20px' }}
              />
              <h3 style={{ 
                textDecoration: isComplete ? 'line-through' : 'none',
                color: isComplete ? 'var(--text-light)' : 'var(--text-dark)'
              }}>
                {task.title}
              </h3>
            </div>
            
            <div className="flex gap-2">
              <button 
                className="btn btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
          
          {task.description && (
            <p style={{ 
              color: isComplete ? 'var(--text-light)' : 'var(--text-dark)',
              textDecoration: isComplete ? 'line-through' : 'none'
            }}>
              {task.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;