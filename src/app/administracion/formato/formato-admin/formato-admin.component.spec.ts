import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoAdminComponent } from './formato-admin.component';

describe('FormatoAdminComponent', () => {
  let component: FormatoAdminComponent;
  let fixture: ComponentFixture<FormatoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
