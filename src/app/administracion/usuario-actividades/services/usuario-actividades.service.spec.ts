import { TestBed } from '@angular/core/testing';
import { UsuarioActividadesService } from './usuario-actividades.service';

describe('UsuarioActividadesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsuarioActividadesService = TestBed.get(UsuarioActividadesService);
    expect(service).toBeTruthy();
  });
});