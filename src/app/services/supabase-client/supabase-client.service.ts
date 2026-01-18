import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@/environments/environment';
import { IDataStore, QueryFilter, QueryOptions } from '@/app/models/data-store.interface';

// Supabase client service implementing abstract database store operations 🔌
@Injectable({
    providedIn: 'root'
})
export class SupabaseClientService implements IDataStore {
    // Supabase client instance initialized with credentials from environment 🗄️
    private readonly client: SupabaseClient;

    constructor() {
        this.client = createClient(
            environment.supabase.url,
            environment.supabase.key
        );
    }

    // Query multiple records from a table with optional filters and sorting 📖
    async query<T>(tableName: string, options?: QueryOptions): Promise<T[]> {
        let query = this.client.from(tableName).select();

        // Apply filters 🔍
        if (options?.filters) {
            for (const filter of options.filters) {
                query = this.applyFilter(query, filter);
            }
        }

        // Apply ordering 📊
        if (options?.orderBy) {
            query = query.order(options.orderBy, {
                ascending: options?.ascending ?? true
            });
        }

        // Apply pagination 📑
        if (options?.limit) {
            query = query.limit(options.limit);
        }
        if (options?.offset) {
            query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
        }

        const { data, error } = await query;
        if (error) throw error;
        return (data as T[]) || [];
    }

    // Query a single record from a table 🎯
    async querySingle<T>(tableName: string, options?: QueryOptions): Promise<T | null> {
        let query = this.client.from(tableName).select();

        // Apply filters 🔍
        if (options?.filters) {
            for (const filter of options.filters) {
                query = this.applyFilter(query, filter);
            }
        }

        const { data, error } = await query.limit(1).single();
        if (error) throw error;
        return (data as T) || null;
    }

    // Insert a new record into a table 📝
    async insert<T>(tableName: string, data: Partial<T>): Promise<T> {
        const { data: result, error } = await this.client
            .from(tableName)
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return result as T;
    }

    // Insert multiple records into a table 📋
    async insertMany<T>(tableName: string, data: Partial<T>[]): Promise<T[]> {
        const { data: results, error } = await this.client
            .from(tableName)
            .insert(data)
            .select();

        if (error) throw error;
        return (results as T[]) || [];
    }

    // Update records in a table based on filters ✏️
    async update<T>(tableName: string, data: Partial<T>, filters: QueryFilter[]): Promise<T[]> {
        let query = this.client.from(tableName).update(data);

        // Apply filters 🔍
        for (const filter of filters) {
            query = this.applyFilter(query, filter) as any;
        }

        const { data: results, error } = await query.select();
        if (error) throw error;
        return (results as T[]) || [];
    }

    // Delete records from a table based on filters 🗑️
    async delete(tableName: string, filters: QueryFilter[]): Promise<void> {
        let query = this.client.from(tableName).delete();

        // Apply filters 🔍
        for (const filter of filters) {
            query = this.applyFilter(query, filter) as any;
        }

        const { error } = await query;
        if (error) throw error;
    }

    // Helper method to apply filters to a query 🔧
    private applyFilter(query: any, filter: QueryFilter): any {
        switch (filter.operator) {
            case 'eq':
                return query.eq(filter.column, filter.value);
            case 'neq':
                return query.neq(filter.column, filter.value);
            case 'gt':
                return query.gt(filter.column, filter.value);
            case 'gte':
                return query.gte(filter.column, filter.value);
            case 'lt':
                return query.lt(filter.column, filter.value);
            case 'lte':
                return query.lte(filter.column, filter.value);
            case 'in':
                return query.in(filter.column, filter.value);
            case 'is':
                return query.is(filter.column, filter.value);
            default:
                return query;
        }
    }
}
