import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugardisponibilidadListComponent } from './lugardisponibilidad-list.component';

describe('LugardisponibilidadListComponent', () => {
  let component: LugardisponibilidadListComponent;
  let fixture: ComponentFixture<LugardisponibilidadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugardisponibilidadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugardisponibilidadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
