import { TestBed } from '@angular/core/testing';

import { FormatoService } from './formato.service';

describe('FormatoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormatoService = TestBed.get(FormatoService);
    expect(service).toBeTruthy();
  });
});
