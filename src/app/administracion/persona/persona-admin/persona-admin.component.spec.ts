import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaAdminComponent } from './persona-admin.component';

describe('PersonaAdminComponent', () => {
  let component: PersonaAdminComponent;
  let fixture: ComponentFixture<PersonaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
