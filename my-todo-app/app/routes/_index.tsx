import { useState, useEffect } from 'react';
import { TodoItem } from '@/components/TodoItem';
import { TodoDialog } from '@/components/TodoDialog';
import { Button } from '@/components/ui/button';
import { Todo } from '~/types/todo';
import jsPDF from 'jspdf';
import 'jspdf-fonts';

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch('/todos');
    const data = await res.json();
    setTodos(data);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFont('NotoSansJP', 'normal');
    doc.text('TODOSampkleリスト リスト', 10, 10);

    let y = 20;
    todos.forEach((todo) => {
      doc.text(
        `- ${todo.completed ? '[完了]' : '[未完了]'} ${todo.title}`,
        10,
        y
      );
      y += 10;
    });

    doc.save('todos.pdf');
  };

  const handleAddTodo = async (newTodo: Todo) => {
    if (newTodo.id) {
      const res = await fetch(`/todos/${newTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });
      if (res.ok) {
        fetchTodos();
      }
    } else {
      const res = await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });
      if (res.ok) {
        fetchTodos();
      }
    }
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    const res = await fetch(`/todos/${updatedTodo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo),
    });
    if (res.ok) {
      fetchTodos();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    const res = await fetch(`/todos/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchTodos();
    }
  };

  const handleOpenDialog = (todo?: Todo) => {
    setSelectedTodo(todo);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TODO アプリ</h1>
      <Button onClick={() => handleOpenDialog()}>TODO 追加</Button>
      <Button onClick={handleExportPdf}>PDF 出力</Button>
      <ul className="mt-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
            onOpenDialog={handleOpenDialog}
          />
        ))}
      </ul>
      <TodoDialog
        todo={selectedTodo}
        onSave={handleAddTodo}
        open={dialogOpen}
        setOpen={setDialogOpen}
      />
    </div>
  );
}
