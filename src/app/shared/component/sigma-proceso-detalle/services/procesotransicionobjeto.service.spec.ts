import { TestBed } from '@angular/core/testing';

import { ProcesotransicionobjetoService } from './procesotransicionobjeto.service';

describe('ProcesotransicionobjetoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcesotransicionobjetoService = TestBed.get(ProcesotransicionobjetoService);
    expect(service).toBeTruthy();
  });
});
