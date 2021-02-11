import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugardisponibilidadCreateComponent } from './lugardisponibilidad-create.component';

describe('LugardisponibilidadCreateComponent', () => {
  let component: LugardisponibilidadCreateComponent;
  let fixture: ComponentFixture<LugardisponibilidadCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugardisponibilidadCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugardisponibilidadCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
