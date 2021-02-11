import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPlantaActividadesComponent } from './personal-planta-actividades.component';

describe('PersonalPlantaActividadesComponent', () => {
  let component: PersonalPlantaActividadesComponent;
  let fixture: ComponentFixture<PersonalPlantaActividadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalPlantaActividadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalPlantaActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
