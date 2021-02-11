import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonadisponibilidadDetailComponent } from './personadisponibilidad-detail.component';

describe('PersonadisponibilidadDetailComponent', () => {
  let component: PersonadisponibilidadDetailComponent;
  let fixture: ComponentFixture<PersonadisponibilidadDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonadisponibilidadDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonadisponibilidadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
