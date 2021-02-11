import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPlantaListComponent } from './personal-planta-list.component';

describe('PersonalPlantaListComponent', () => {
  let component: PersonalPlantaListComponent;
  let fixture: ComponentFixture<PersonalPlantaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalPlantaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalPlantaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
