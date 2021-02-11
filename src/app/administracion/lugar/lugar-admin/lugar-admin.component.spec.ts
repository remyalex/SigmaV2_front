import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarAdminComponent } from './lugar-admin.component';

describe('LugarAdminComponent', () => {
  let component: LugarAdminComponent;
  let fixture: ComponentFixture<LugarAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugarAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
