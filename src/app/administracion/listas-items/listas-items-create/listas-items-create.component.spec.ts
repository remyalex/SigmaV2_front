import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasItemsCreateComponent } from './listas-items-create.component';

describe('ListasItemsCreateComponent', () => {
  let component: ListasItemsCreateComponent;
  let fixture: ComponentFixture<ListasItemsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasItemsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasItemsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
