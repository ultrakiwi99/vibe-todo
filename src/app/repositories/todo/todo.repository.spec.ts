import { TestBed } from '@angular/core/testing';
import { TodoRepository } from './todo.repository';
import { IDataStore } from '@/app/models/data-store.interface';
import { SupabaseClientService } from '@/app/services/supabase-client/supabase-client.service';

const MockDataStore: IDataStore = {} as IDataStore;

describe('TodoRepository', () => {
    let repository: TodoRepository;

    beforeEach(() => {
        TestBed.overrideProvider(SupabaseClientService, { useValue: MockDataStore });
        repository = TestBed.inject(TodoRepository);
    });

    describe('create', () => {

        it('should create a new todo', async () => {
            const result = await repository.create('New Test Todo');

            expect(result).toBeTruthy();
            expect(result.title).toBe('New Test Todo');
            expect(result.completed).toBe(false);
            expect(result.id).toBeTruthy();
        });
    });

    describe('readAll', () => {
        it('should fetch all todos', async () => {
            const result = await repository.readAll();

            expect(result).toBeTruthy();
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('readAllWithFilters', () => {
        it('should fetch completed todos only', async () => {
            const result = await repository.readAllWithFilters([
                { column: 'completed', operator: 'eq', value: true }
            ]);

            expect(result).toBeTruthy();
            expect(result.every(todo => todo.completed)).toBe(true);
        });

        it('should fetch incomplete todos only', async () => {
            const result = await repository.readAllWithFilters([
                { column: 'completed', operator: 'eq', value: false }
            ]);

            expect(result).toBeTruthy();
            expect(result.every(todo => !todo.completed)).toBe(true);
        });
    });

    describe('readById', () => {
        it('should fetch a single todo by id', async () => {
            const result = await repository.readById(1);

            expect(result).toBeTruthy();
            expect(result?.id).toBe(1);
        });

        it('should return null when todo not found', async () => {
            const result = await repository.readById(999);

            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update a todo title', async () => {
            const result = await repository.update(1, { title: 'Updated Todo' });

            expect(result).toBeTruthy();
            expect(result[0].title).toBe('Updated Todo');
        });

        it('should update a todo completed status', async () => {
            const result = await repository.update(1, { completed: true });

            expect(result).toBeTruthy();
            expect(result[0].completed).toBe(true);
        });
    });

    describe('delete', () => {
        it('should delete a todo', async () => {
            await repository.delete(1);

            const result = await repository.readById(1);
            expect(result).toBeNull();
        });
    });

    describe('toggleCompleted', () => {
        it('should toggle todo to completed', async () => {
            const result = await repository.toggleCompleted(1, true);

            expect(result[0].completed).toBe(true);
        });

        it('should toggle todo to incomplete', async () => {
            const result = await repository.toggleCompleted(2, false);

            expect(result[0].completed).toBe(false);
        });
    });

    describe('deleteCompleted', () => {
        it('should delete all completed todos', async () => {
            const countBefore = (await repository.readAll()).length;
            await repository.deleteCompleted();
            const countAfter = (await repository.readAll()).length;

            expect(countAfter).toBeLessThan(countBefore);
        });
    });

    describe('getCompletedCount', () => {
        it('should return count of completed todos', async () => {
            const count = await repository.getCompletedCount();

            expect(count).toBeGreaterThanOrEqual(0);
        });
    });

    describe('getRemainingCount', () => {
        it('should return count of remaining todos', async () => {
            const count = await repository.getRemainingCount();

            expect(count).toBeGreaterThanOrEqual(0);
        });
    });
});
