import { IDataStore, QueryFilter, QueryOptions } from '@/app/models/data-store.interface';

// Mock data store implementation with hardcoded test data 🎭
export class MockDataStore implements IDataStore {
    // Hardcoded mock todos for testing 📋
    private mockTodos = [
        { id: 1, title: 'Test Todo 1', completed: false },
        { id: 2, title: 'Test Todo 2', completed: true },
        { id: 3, title: 'Test Todo 3', completed: false }
    ];

    // Query multiple records with optional filters 📖
    async query<T>(tableName: string, options?: QueryOptions): Promise<T[]> {
        let results = [...this.mockTodos] as T[];

        // Apply filters 🔍
        if (options?.filters) {
            results = this.applyFilters(results, options.filters);
        }

        // Apply ordering 📊
        if (options?.orderBy) {
            results = this.applyOrdering(results, options.orderBy, options?.ascending ?? true);
        }

        // Apply pagination 📑
        if (options?.offset) {
            const limit = options?.limit ?? 10;
            results = results.slice(options.offset, options.offset + limit);
        }

        return results;
    }

    // Query a single record with optional filters 🎯
    async querySingle<T>(tableName: string, options?: QueryOptions): Promise<T | null> {
        const results = await this.query<T>(tableName, options);
        return results.length > 0 ? results[0] : null;
    }

    // Insert a new record 📝
    async insert<T>(tableName: string, data: Partial<T>): Promise<T> {
        const newId = Math.max(...this.mockTodos.map(t => t.id), 0) + 1;
        const newRecord = { id: newId, ...data } as T;
        this.mockTodos.push(newRecord as any);
        return newRecord;
    }

    // Insert multiple records 📋
    async insertMany<T>(tableName: string, data: Partial<T>[]): Promise<T[]> {
        const results: T[] = [];
        for (const item of data) {
            results.push(await this.insert(tableName, item));
        }
        return results;
    }

    // Update records based on filters ✏️
    async update<T>(tableName: string, data: Partial<T>, filters: QueryFilter[]): Promise<T[]> {
        const results: T[] = [];
        for (const todo of this.mockTodos) {
            if (this.matchesFilters(todo, filters)) {
                Object.assign(todo, data);
                results.push(todo as T);
            }
        }
        return results;
    }

    // Delete records based on filters 🗑️
    async delete(tableName: string, filters: QueryFilter[]): Promise<void> {
        this.mockTodos = this.mockTodos.filter(todo => !this.matchesFilters(todo, filters));
    }

    // Helper method to apply filters 🔧
    private applyFilters<T>(data: T[], filters: QueryFilter[]): T[] {
        return data.filter(item => this.matchesFilters(item, filters));
    }

    // Helper method to check if item matches all filters 🔍
    private matchesFilters(item: any, filters: QueryFilter[]): boolean {
        return filters.every(filter => {
            const value = item[filter.column];
            switch (filter.operator) {
                case 'eq':
                    return value === filter.value;
                case 'neq':
                    return value !== filter.value;
                case 'gt':
                    return value > filter.value;
                case 'gte':
                    return value >= filter.value;
                case 'lt':
                    return value < filter.value;
                case 'lte':
                    return value <= filter.value;
                case 'in':
                    return Array.isArray(filter.value) && filter.value.includes(value);
                case 'is':
                    return value === filter.value;
                default:
                    return true;
            }
        });
    }

    // Helper method to apply ordering 📊
    private applyOrdering<T>(data: T[], orderBy: string, ascending: boolean): T[] {
        return data.sort((a: any, b: any) => {
            const aVal = a[orderBy];
            const bVal = b[orderBy];
            if (aVal < bVal) return ascending ? -1 : 1;
            if (aVal > bVal) return ascending ? 1 : -1;
            return 0;
        });
    }
}
