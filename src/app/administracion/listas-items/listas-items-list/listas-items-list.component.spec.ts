import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasItemsListComponent } from './listas-items-list.component';

describe('ListasItemsListComponent', () => {
  let component: ListasItemsListComponent;
  let fixture: ComponentFixture<ListasItemsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasItemsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
