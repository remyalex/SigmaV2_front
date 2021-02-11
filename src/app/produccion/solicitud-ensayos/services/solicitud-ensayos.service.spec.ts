import { TestBed } from '@angular/core/testing';
import { SolicitudEnsayosService } from './solicitud-ensayos.service';

describe('SolicitudEnsayosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SolicitudEnsayosService = TestBed.get(SolicitudEnsayosService);
    expect(service).toBeTruthy();
  });
});