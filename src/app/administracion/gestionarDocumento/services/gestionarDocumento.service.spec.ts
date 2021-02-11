import { TestBed } from '@angular/core/testing';

import { GestionarDocumentoService } from './gestionarDocumento.service';

describe('gestionarDocumentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionarDocumentoService = TestBed.get(GestionarDocumentoService);
    expect(service).toBeTruthy();
  });
});
