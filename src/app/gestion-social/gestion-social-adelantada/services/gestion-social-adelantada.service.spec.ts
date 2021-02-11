import { GestionSocialAdelantadaService } from './gestion-social-adelantada.service';
import { TestBed } from '@angular/core/testing';

describe('GestionSocialAdelantadaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionSocialAdelantadaService = TestBed.get(GestionSocialAdelantadaService);
    expect(service).toBeTruthy();
  });
});