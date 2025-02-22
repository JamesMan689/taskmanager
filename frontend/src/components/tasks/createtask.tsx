// create task component

import {useState} from 'react';
import axios from "axios";
import { Task, CreateTaskInput } from '../../types/task.types';

interface CreateTaskProps {
  onTaskCreated: (task: Task) => void;
}

const CreateTask = ({onTaskCreated}: CreateTaskProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!title.trim()) return;

    setIsSubmitting(true);

    const taskData: CreateTaskInput = {
      title: title.trim(),
      description: description.trim() || undefined
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/tasks',
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      onTaskCreated(response.data);
      setTitle('');
      setDescription('');
      setIsExpanded(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error creating task: ', error);
      setIsSubmitting(false);
    }
  };

  return(
    <div className="create-task">
      <form onSubmit={handleSubmit}>
        <div className="create-task-input">
          <input 
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task Title"
            onFocus={() => setIsExpanded(true)}
            required
          />
          {!isExpanded && (
            <button type="submit" disabled={isSubmitting || !title.trim()}>
              add
            </button>
          )}
        </div>

        {isExpanded && (
          <>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
            />

            <div className="create-task-actions">
              <button type="button" onClick={() => setIsExpanded(false)}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting || !title.trim()}>
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CreateTask;