import { TestBed } from '@angular/core/testing';

import { EquipocalendarioService } from './equipocalendario.service';

describe('EquipocalendarioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EquipocalendarioService = TestBed.get(EquipocalendarioService);
    expect(service).toBeTruthy();
  });
});
