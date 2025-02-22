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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!title.trim()) return;

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
    } catch (error) {
      console.error('Error creating task: ', error);
    }
  };

  return(
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            onFocus={() => setIsExpanded(true)}
            required
          />
        </div>
        
        {isExpanded && (
          <>
            <div className="form-group">
              <textarea
                className="form-control"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add details (optional)"
                rows={3}
              />
            </div>
            
            <div className="flex" style={{ justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Add Task
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CreateTask;