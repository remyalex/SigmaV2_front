import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrfeoAdminComponent } from './orfeo-admin.component';

describe('OrfeoAdminComponent', () => {
  let component: OrfeoAdminComponent;
  let fixture: ComponentFixture<OrfeoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrfeoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrfeoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
