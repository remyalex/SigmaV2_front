import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseccionDetailComponent } from './formatoseccion-detail.component';

describe('FormatoseccionDetailComponent', () => {
  let component: FormatoseccionDetailComponent;
  let fixture: ComponentFixture<FormatoseccionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoseccionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseccionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
