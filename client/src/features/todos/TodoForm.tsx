import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface TodoFormProps {
  onSubmit: (title: string) => Promise<void>;
  isLoading?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(title);
      setTitle('');
    } catch (err) {
      console.error('Failed to add todo:', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="flex gap-sm">
        <Input
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading || isSubmitting}
          className="flex-1"
        />
        <Button type="submit" isLoading={isLoading || isSubmitting} disabled={!title.trim() || isSubmitting}>
          Add
        </Button>
      </div>
    </form>
  );
};
