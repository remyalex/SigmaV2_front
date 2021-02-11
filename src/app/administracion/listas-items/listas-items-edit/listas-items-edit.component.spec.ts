import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasItemsEditComponent } from './listas-items-edit.component';

describe('ListasItemsEditComponent', () => {
  let component: ListasItemsEditComponent;
  let fixture: ComponentFixture<ListasItemsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasItemsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasItemsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
