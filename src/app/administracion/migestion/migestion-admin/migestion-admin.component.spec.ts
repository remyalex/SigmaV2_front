import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiGestionAdminComponent } from './migestion-admin.component';

describe('MiGestionAdminComponent', () => {
  let component: MiGestionAdminComponent;
  let fixture: ComponentFixture<MiGestionAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiGestionAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiGestionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
