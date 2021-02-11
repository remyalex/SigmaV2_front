import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasItemsDetailComponent } from './listas-items-detail.component';

describe('ListasItemsDetailComponent', () => {
  let component: ListasItemsDetailComponent;
  let fixture: ComponentFixture<ListasItemsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasItemsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasItemsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
