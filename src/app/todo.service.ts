import { Injectable, signal } from '@angular/core';
import { Todo } from './todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos = signal<Todo[]>([
    { id: 1, title: 'Learn Angular signals', completed: true },
    { id: 2, title: 'Build a todo app', completed: false },
    { id: 3, title: 'Master TypeScript', completed: false },
    { id: 4, title: 'Write clean code', completed: true },
    { id: 5, title: 'Deploy to production', completed: false }
  ]);

  getTodos() {
    return this.todos.asReadonly();
  }

  addTodo(title: string) {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false
    };
    this.todos.update(todos => [...todos, newTodo]);
  }

  toggleTodo(id: number) {
    this.todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  deleteTodo(id: number) {
    this.todos.update(todos => todos.filter(todo => todo.id !== id));
  }
}
