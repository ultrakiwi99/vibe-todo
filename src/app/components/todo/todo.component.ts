import { Component, ChangeDetectionStrategy, computed, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo/todo.service';

@Component({
  selector: 'app-todo',
  imports: [FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  private todoService = inject(TodoService);
  
  protected todos = this.todoService.getTodos();
  protected newTodoTitle = signal('');
  
  protected remainingCount = computed(() => {
    return this.todos().filter(todo => !todo.completed).length;
  });
  
  protected completedCount = computed(() => {
    return this.todos().filter(todo => todo.completed).length;
  });

  protected addTodo() {
    const title = this.newTodoTitle().trim();
    if (title) {
      this.todoService.addTodo(title);
      this.newTodoTitle.set('');
    }
  }

  protected toggleTodo(id: number) {
    this.todoService.toggleTodo(id);
  }

  protected deleteTodo(id: number) {
    this.todoService.deleteTodo(id);
  }
}
