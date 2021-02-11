import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseccionCreateComponent } from './formatoseccion-create.component';

describe('FormatoseccionCreateComponent', () => {
  let component: FormatoseccionCreateComponent;
  let fixture: ComponentFixture<FormatoseccionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoseccionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseccionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
