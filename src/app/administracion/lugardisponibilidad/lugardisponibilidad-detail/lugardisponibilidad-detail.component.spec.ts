import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugardisponibilidadDetailComponent } from './lugardisponibilidad-detail.component';

describe('LugardisponibilidadDetailComponent', () => {
  let component: LugardisponibilidadDetailComponent;
  let fixture: ComponentFixture<LugardisponibilidadDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugardisponibilidadDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugardisponibilidadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
