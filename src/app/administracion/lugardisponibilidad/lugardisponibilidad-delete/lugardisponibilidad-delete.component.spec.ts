import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugardisponibilidadDeleteComponent } from './lugardisponibilidad-delete.component';

describe('LugardisponibilidadDeleteComponent', () => {
  let component: LugardisponibilidadDeleteComponent;
  let fixture: ComponentFixture<LugardisponibilidadDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugardisponibilidadDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugardisponibilidadDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
