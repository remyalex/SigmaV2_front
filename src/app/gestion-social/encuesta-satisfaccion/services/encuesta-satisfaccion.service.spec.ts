import { TestBed } from '@angular/core/testing';
import { EncuestaSatisfaccionService } from './encuesta-satisfaccion.service';

describe('EncuestaSatisfaccionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncuestaSatisfaccionService = TestBed.get(EncuestaSatisfaccionService);
    expect(service).toBeTruthy();
  });
});