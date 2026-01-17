import { Injectable, signal, computed } from '@angular/core';
import { Todo } from '@/app/models/todo.model';

// Function to create hardcoded initial todos 🏭
function getInitialTodos(): Todo[] {
    return [
    { id: 1, title: 'Learn Angular signals', completed: true },
    { id: 2, title: 'Build a todo app', completed: false },
    { id: 3, title: 'Master TypeScript', completed: false },
    { id: 4, title: 'Write clean code', completed: true },
    { id: 5, title: 'Deploy to production', completed: false }
    ];
}

// Todo service managing a list of hardcoded todos with signal-based local state management 🍭
@Injectable({
    providedIn: 'root'
})
export class TodoService {
    // Local state holding hardcoded todo list 📦
    private todos = signal<Todo[]>(getInitialTodos());

    // Return readonly signal to prevent external mutations 🐳
  getTodos() {
    return this.todos.asReadonly();
  }

    // Get a single todo item by id 🎯
    getTodoById(id: number) {
        return computed(() => this.todos().find(todo => todo.id === id));
    }

    // Check if todo exists 🔍
    hasTodo(id: number) {
        return computed(() => this.todos().some(todo => todo.id === id));
    }

    // Get count of completed todos 📊
    getCompletedCount() {
        return computed(() => this.todos().filter(todo => todo.completed).length);
    }

    // Get count of remaining todos 📊
    getRemainingCount() {
        return computed(() => this.todos().filter(todo => !todo.completed).length);
    }

    // Add a new todo to the list 📝
  addTodo(title: string) {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false
    };
    this.todos.update(todos => [...todos, newTodo]);
  }

    // Update a todo item by id ✏️
    updateTodo(id: number, updates: Partial<Todo>) {
        this.todos.update(todos =>
            todos.map(todo =>
                todo.id === id ? { ...todo, ...updates } : todo
            )
        );
    }

    // Toggle the completed status of a todo 🔄
  toggleTodo(id: number) {
    this.todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

    // Delete a todo by id 🗑️
  deleteTodo(id: number) {
    this.todos.update(todos => todos.filter(todo => todo.id !== id));
  }

    // Clear all completed todos 🧹
    clearCompleted() {
        this.todos.update(todos => todos.filter(todo => !todo.completed));
    }

    // Reset todos to hardcoded initial state 🔄
    resetTodos() {
        this.todos.set(getInitialTodos());
    }
}
