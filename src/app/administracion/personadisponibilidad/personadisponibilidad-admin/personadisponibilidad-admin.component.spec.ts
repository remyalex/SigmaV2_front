import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonadisponibilidadAdminComponent } from './personadisponibilidad-admin.component';

describe('PersonadisponibilidadAdminComponent', () => {
  let component: PersonadisponibilidadAdminComponent;
  let fixture: ComponentFixture<PersonadisponibilidadAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonadisponibilidadAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonadisponibilidadAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
