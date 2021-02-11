import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPlantaEditComponent } from './personal-planta-edit.component';

describe('PersonalPlantaEditComponent', () => {
  let component: PersonalPlantaEditComponent;
  let fixture: ComponentFixture<PersonalPlantaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalPlantaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalPlantaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
