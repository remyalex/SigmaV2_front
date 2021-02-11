import { TestBed } from '@angular/core/testing';

import { ListaItemsService } from './listas-items.service';

describe('ListaItemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListaItemsService = TestBed.get(ListaItemsService);
    expect(service).toBeTruthy();
  });
});
