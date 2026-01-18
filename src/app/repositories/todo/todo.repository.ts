import { inject, Inject, Injectable } from '@angular/core';
import { IDataStore, QueryFilter } from '@/app/models/data-store.interface';
import { Todo } from '@/app/models/todo.model';
import { environment } from '@/environments/environment';
import { SupabaseClientService } from '@/app/services/supabase-client/supabase-client.service';

// Todo repository managing todo operations with interface-based dependency injection 🏛️
@Injectable({
    providedIn: 'root'
})
@Inject(SupabaseClientService)
export class TodoRepository {
    // Table name for todos with environment prefix 📋
    private tableName = `${environment.tablePrefix}_todos`;
    private dataStore: IDataStore = inject(SupabaseClientService);

    // Create a new todo in the database 📝
    async create(title: string): Promise<Todo> {
        return this.dataStore.insert<Todo>(this.tableName, {
            title,
            completed: false
        });
    }

    // Read all todos from the database 📖
    async readAll(): Promise<Todo[]> {
        return this.dataStore.query<Todo>(this.tableName);
    }

    // Read all todos with specific filters 🔍
    async readAllWithFilters(filters: QueryFilter[]): Promise<Todo[]> {
        return this.dataStore.query<Todo>(this.tableName, { filters });
    }

    // Read a single todo by id from the database 🎯
    async readById(id: number): Promise<Todo | null> {
        const filters: QueryFilter[] = [
            { column: 'id', operator: 'eq', value: id }
        ];
        return this.dataStore.querySingle<Todo>(this.tableName, { filters });
    }

    // Update a todo in the database ✏️
    async update(id: number, updates: Partial<Todo>): Promise<Todo[]> {
        const filters: QueryFilter[] = [
            { column: 'id', operator: 'eq', value: id }
        ];
        return this.dataStore.update<Todo>(this.tableName, updates, filters);
    }

    // Delete a todo from the database 🗑️
    async delete(id: number): Promise<void> {
        const filters: QueryFilter[] = [
            { column: 'id', operator: 'eq', value: id }
        ];
        return this.dataStore.delete(this.tableName, filters);
    }

    // Toggle the completed status of a todo 🔄
    async toggleCompleted(id: number, completed: boolean): Promise<Todo[]> {
        return this.update(id, { completed });
    }

    // Delete all completed todos from the database 🧹
    async deleteCompleted(): Promise<void> {
        const filters: QueryFilter[] = [
            { column: 'completed', operator: 'eq', value: true }
        ];
        return this.dataStore.delete(this.tableName, filters);
    }

    // Get count of completed todos 📊
    async getCompletedCount(): Promise<number> {
        const filters: QueryFilter[] = [
            { column: 'completed', operator: 'eq', value: true }
        ];
        const completed = await this.dataStore.query<Todo>(this.tableName, { filters });
        return completed.length;
    }

    // Get count of remaining todos 📊
    async getRemainingCount(): Promise<number> {
        const filters: QueryFilter[] = [
            { column: 'completed', operator: 'eq', value: false }
        ];
        const remaining = await this.dataStore.query<Todo>(this.tableName, { filters });
        return remaining.length;
    }
}
