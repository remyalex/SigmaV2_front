import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasListComponent } from './listas-list.component';

describe('ListasListComponent', () => {
  let component: ListasListComponent;
  let fixture: ComponentFixture<ListasListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
