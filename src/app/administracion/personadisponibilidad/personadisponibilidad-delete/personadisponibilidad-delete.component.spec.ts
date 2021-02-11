import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonadisponibilidadDeleteComponent } from './personadisponibilidad-delete.component';

describe('PersonadisponibilidadDeleteComponent', () => {
  let component: PersonadisponibilidadDeleteComponent;
  let fixture: ComponentFixture<PersonadisponibilidadDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonadisponibilidadDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonadisponibilidadDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
