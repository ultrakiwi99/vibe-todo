// Generic query filter for database operations 🔍
export interface QueryFilter {
    column: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'is';
    value: any;
}

// Generic query options for database operations 🔎
export interface QueryOptions {
    filters?: QueryFilter[];
    limit?: number;
    offset?: number;
    orderBy?: string;
    ascending?: boolean;
}

// Abstract interface defining contract for database store operations 📋
export interface IDataStore {
    // Query/read data from a table 📖
    query<T>(tableName: string, options?: QueryOptions): Promise<T[]>;

    // Query a single record from a table 🎯
    querySingle<T>(tableName: string, options?: QueryOptions): Promise<T | null>;

    // Insert a new record into a table 📝
    insert<T>(tableName: string, data: Partial<T>): Promise<T>;

    // Insert multiple records into a table 📋
    insertMany<T>(tableName: string, data: Partial<T>[]): Promise<T[]>;

    // Update records in a table ✏️
    update<T>(tableName: string, data: Partial<T>, filters: QueryFilter[]): Promise<T[]>;

    // Delete records from a table 🗑️
    delete(tableName: string, filters: QueryFilter[]): Promise<void>;
}
