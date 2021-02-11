import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseccionEditComponent } from './formatoseccion-edit.component';

describe('FormatoseccionEditComponent', () => {
  let component: FormatoseccionEditComponent;
  let fixture: ComponentFixture<FormatoseccionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoseccionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseccionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
