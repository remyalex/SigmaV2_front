import { TestBed } from '@angular/core/testing';
import { RegistroMezclaInsumosService } from './registro-mezcla-insumos.service';

describe('RegistroMezclaInsumosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistroMezclaInsumosService = TestBed.get(RegistroMezclaInsumosService);
    expect(service).toBeTruthy();
  });
});