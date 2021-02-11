import { TestBed } from '@angular/core/testing';

import { EquipodisponibilidadService } from './equipodisponibilidad.service';

describe('EquipodisponibilidadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EquipodisponibilidadService = TestBed.get(EquipodisponibilidadService);
    expect(service).toBeTruthy();
  });
});
