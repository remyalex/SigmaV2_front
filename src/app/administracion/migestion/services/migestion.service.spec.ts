import { TestBed } from '@angular/core/testing';

import { MiGestionService } from './migestion.service';

describe('WidgetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MiGestionService = TestBed.get(MiGestionService);
    expect(service).toBeTruthy();
  });
});
