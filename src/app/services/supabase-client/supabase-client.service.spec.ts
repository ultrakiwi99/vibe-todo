import { TestBed } from '@angular/core/testing';
import { SupabaseClientService } from './supabase-client.service';
import { IDataStore, QueryFilter, QueryOptions } from '@/app/models/data-store.interface';

describe('SupabaseClientService', () => {
    let service: SupabaseClientService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SupabaseClientService]
        });
        service = TestBed.inject(SupabaseClientService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should implement IDataStore interface', () => {
        const dataStore = service as IDataStore;
        expect(dataStore.query).toBeDefined();
        expect(dataStore.querySingle).toBeDefined();
        expect(dataStore.insert).toBeDefined();
        expect(dataStore.insertMany).toBeDefined();
        expect(dataStore.update).toBeDefined();
        expect(dataStore.delete).toBeDefined();
    });

    it('should have query method defined', () => {
        expect(service.query).toBeDefined();
    });

    it('should have querySingle method defined', () => {
        expect(service.querySingle).toBeDefined();
    });

    it('should have insert method defined', () => {
        expect(service.insert).toBeDefined();
    });

    it('should have insertMany method defined', () => {
        expect(service.insertMany).toBeDefined();
    });

    it('should have update method defined', () => {
        expect(service.update).toBeDefined();
    });

    it('should have delete method defined', () => {
        expect(service.delete).toBeDefined();
    });
});
