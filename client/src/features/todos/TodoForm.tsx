import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface TodoFormProps {
  onSubmit: (title: string) => Promise<void>;
  isLoading?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await onSubmit(title);
      setTitle('');
    } catch (err) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="flex gap-sm">
        <Input
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" isLoading={isLoading} disabled={!title.trim()}>
          Add
        </Button>
      </div>
    </form>
  );
};
