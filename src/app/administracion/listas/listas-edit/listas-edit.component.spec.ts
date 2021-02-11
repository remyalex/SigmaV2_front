import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasEditComponent } from './listas-edit.component';

describe('ListasEditComponent', () => {
  let component: ListasEditComponent;
  let fixture: ComponentFixture<ListasEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
