import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonadisponibilidadEditComponent } from './personadisponibilidad-edit.component';

describe('PersonadisponibilidadEditComponent', () => {
  let component: PersonadisponibilidadEditComponent;
  let fixture: ComponentFixture<PersonadisponibilidadEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonadisponibilidadEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonadisponibilidadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
