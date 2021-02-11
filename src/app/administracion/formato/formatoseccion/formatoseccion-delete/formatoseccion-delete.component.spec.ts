import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseccionDeleteComponent } from './formatoseccion-delete.component';

describe('FormatoseccionDeleteComponent', () => {
  let component: FormatoseccionDeleteComponent;
  let fixture: ComponentFixture<FormatoseccionDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoseccionDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseccionDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
