import { Component, ChangeDetectionStrategy, computed, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '@/app/services/todo/todo.service';

// Todo list component managing todo items with add, delete, toggle, and batch operations 📝
@Component({
  selector: 'app-todo',
  imports: [FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent implements OnInit {
  private todoService = inject(TodoService);
  
  protected todos = this.todoService.getTodos();
  protected newTodoTitle = signal('');
  
  protected remainingCount = computed(() => {
    return this.todos().filter(todo => !todo.completed).length;
  });
  
  protected completedCount = computed(() => {
    return this.todos().filter(todo => todo.completed).length;
  });

  async ngOnInit() {
    await this.todoService.loadTodos();
  }

  protected async addTodo() {
    const title = this.newTodoTitle().trim();
    if (title) {
      await this.todoService.addTodo(title);
      this.newTodoTitle.set('');
    }
  }

  protected async toggleTodo(id: number) {
    await this.todoService.toggleTodo(id);
  }

  protected async deleteTodo(id: number) {
    await this.todoService.deleteTodo(id);
  }

  // Clear all completed todos 🧹
  protected async clearCompleted() {
    await this.todoService.clearCompleted();
  }

  // Reset todos to initial state 🔄
  protected async resetTodos() {
    await this.todoService.resetTodos();
  }
}
