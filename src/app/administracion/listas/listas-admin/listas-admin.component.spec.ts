import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasAdminComponent } from './listas-admin.component';

describe('ListasAdminComponent', () => {
  let component: ListasAdminComponent;
  let fixture: ComponentFixture<ListasAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
