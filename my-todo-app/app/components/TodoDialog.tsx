import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Todo } from '~/types/todo';
import { z } from 'zod';

type TodoDialogProps = {
  todo?: Todo;
  onSave: (todo: Todo) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const todoSchema = z.object({
  title: z.string().min(1, { message: 'タイトルを入力してください' }),
});

export const TodoDialog: React.FC<TodoDialogProps> = ({ todo, onSave, open, setOpen }) => {
  const [title, setTitle] = useState(todo?.title || '');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const result = todoSchema.safeParse({ title });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    onSave({ ...todo, title: title } as Todo);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{todo ? 'TODO 編集' : 'TODO 追加'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right">タイトル</label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>{todo ? '更新' : '保存'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
