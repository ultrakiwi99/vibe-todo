import { Component, signal } from '@angular/core';
import { TodoComponent } from './components/todo/todo.component';

// Root application component importing and displaying the todo list 🏠
@Component({
  selector: 'app-root',
  imports: [TodoComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('vibe-todo');
}
