import { Injectable, signal, computed, inject } from '@angular/core';
import { Todo } from '@/app/models/todo.model';
import { TodoRepository } from '@/app/repositories/todo/todo.repository';

// Todo service managing a list of hardcoded todos with signal-based local state management 🍭
@Injectable({
    providedIn: 'root'
})
export class TodoService {
  private todoRepository = inject(TodoRepository);
  private todos = signal<Todo[]>([]);

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
    async loadTodos() {
        const todos = await this.todoRepository.readAll();
        this.todos.set(todos);
    }

    async addTodo(title: string) {
        const created = await this.todoRepository.create(title);
        this.todos.update(todos => [...todos, created]);
    }

    // Update a todo item by id ✏️
    async updateTodo(id: number, updates: Partial<Todo>) {
      const [updated] = await this.todoRepository.update(id, updates);
      if (!updated) {
        return;
      }
      this.todos.update(todos =>
        todos.map(todo =>
          todo.id === id ? updated : todo
        )
      );
    }

    // Toggle the completed status of a todo 🔄
    async toggleTodo(id: number) {
        const current = this.todos().find(todo => todo.id === id);
        if (!current) {
            return;
        }
        const [updated] = await this.todoRepository.toggleCompleted(id, !current.completed);
        if (!updated) {
            return;
        }
        this.todos.update(todos =>
            todos.map(todo =>
                todo.id === id ? updated : todo
            )
        );
    }

    // Delete a todo by id 🗑️
    async deleteTodo(id: number) {
        await this.todoRepository.delete(id);
        this.todos.update(todos => todos.filter(todo => todo.id !== id));
    }

    // Clear all completed todos 🧹
    async clearCompleted() {
      await this.todoRepository.deleteCompleted();
      this.todos.update(todos => todos.filter(todo => !todo.completed));
    }

    // Reset todos to hardcoded initial state 🔄
    async resetTodos() {
      await this.loadTodos();
    }
}
