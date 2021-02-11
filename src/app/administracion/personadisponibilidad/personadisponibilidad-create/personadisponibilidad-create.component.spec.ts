import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonadisponibilidadCreateComponent } from './personadisponibilidad-create.component';

describe('PersonadisponibilidadCreateComponent', () => {
  let component: PersonadisponibilidadCreateComponent;
  let fixture: ComponentFixture<PersonadisponibilidadCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonadisponibilidadCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonadisponibilidadCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
