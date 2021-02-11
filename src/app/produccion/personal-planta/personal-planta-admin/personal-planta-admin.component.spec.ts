import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPlantaAdminComponent } from './personal-planta-admin.component';

describe('PersonalPlantaAdminComponent', () => {
  let component: PersonalPlantaAdminComponent;
  let fixture: ComponentFixture<PersonalPlantaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalPlantaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalPlantaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
