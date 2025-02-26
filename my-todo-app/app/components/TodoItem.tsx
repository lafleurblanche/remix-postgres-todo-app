import { Todo } from '~/types/todo';

type TodoItemProps = {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onOpenDialog: (todo: Todo) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete, onOpenDialog }) => {
  return (
    <li className="flex items-center justify-between py-2 border-b">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onUpdate({ ...todo, completed: e.target.checked })}
          className="mr-2"
        />
        <span className={todo.completed ? 'line-through' : ''}>{todo.title}</span>
      </div>
      <div>
        <button onClick={() => onOpenDialog(todo)} className="mr-2">編集</button>
        <button onClick={() => onDelete(todo.id)}>削除</button>
      </div>
    </li>
  );
};
