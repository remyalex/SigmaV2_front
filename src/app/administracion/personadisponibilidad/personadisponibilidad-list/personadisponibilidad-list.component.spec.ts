import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonadisponibilidadListComponent } from './personadisponibilidad-list.component';

describe('PersonadisponibilidadListComponent', () => {
  let component: PersonadisponibilidadListComponent;
  let fixture: ComponentFixture<PersonadisponibilidadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonadisponibilidadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonadisponibilidadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
