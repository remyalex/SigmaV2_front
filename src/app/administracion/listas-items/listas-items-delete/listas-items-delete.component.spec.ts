import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasDeleteComponent } from './listas-delete.component';

describe('ListasDeleteComponent', () => {
  let component: ListasDeleteComponent;
  let fixture: ComponentFixture<ListasDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
