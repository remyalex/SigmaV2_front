import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugardisponibilidadEditComponent } from './lugardisponibilidad-edit.component';

describe('LugardisponibilidadEditComponent', () => {
  let component: LugardisponibilidadEditComponent;
  let fixture: ComponentFixture<LugardisponibilidadEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugardisponibilidadEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugardisponibilidadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
