import { TestBed } from '@angular/core/testing';
import { AsignarConductoresMaquinariaService } from './asignar-conductores-maquinaria.service';

describe('AsignarConductoresMaquinariaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AsignarConductoresMaquinariaService = TestBed.get(AsignarConductoresMaquinariaService);
    expect(service).toBeTruthy();
  });
});