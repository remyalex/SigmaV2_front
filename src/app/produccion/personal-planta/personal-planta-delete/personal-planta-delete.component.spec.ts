import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPlantaDeleteComponent } from './personal-planta-delete.component';

describe('PersonalPlantaDeleteComponent', () => {
  let component: PersonalPlantaDeleteComponent;
  let fixture: ComponentFixture<PersonalPlantaDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalPlantaDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalPlantaDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
