import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasItemsAdminComponent } from './listas-items-admin.component';

describe('ListasItemsAdminComponent', () => {
  let component: ListasItemsAdminComponent;
  let fixture: ComponentFixture<ListasItemsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasItemsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasItemsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
