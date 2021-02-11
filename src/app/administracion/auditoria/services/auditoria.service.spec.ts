import { TestBed } from '@angular/core/testing';

import { AuditoriaService } from './auditoria.service';

describe('AuditoriaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditoriaService = TestBed.get(AuditoriaService);
    expect(service).toBeTruthy();
  });
});
