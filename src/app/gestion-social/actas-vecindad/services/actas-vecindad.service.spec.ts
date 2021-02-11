import { TestBed } from '@angular/core/testing';
import { ActasService } from './actas-vecindad.service';

describe('ActasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActasService = TestBed.get(ActasService);
    expect(service).toBeTruthy();
  });
});