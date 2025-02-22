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
    <div className={`task-item ${isComplete ? 'completed' : ''}`}>
      <div className="task-checkbox">
        <input 
          type="checkbox"
          checked={isComplete}
          onChange={handleCompleteToggle}
        />
      </div>

      <div className="task-content">
        {isEditing ? (
          <div className="task-edit-form">
            <input 
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title (required)"
              required
            />
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
            />

            <div>
              <button onClick={handleSaveUpdate}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ):(
          <>
            <h3 className="task-title">{task.title}</h3>
            {task.description && <p className="task-description">{task.description}</p>}
            <div className="task-actions">
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button className="delete-button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default TaskItem;