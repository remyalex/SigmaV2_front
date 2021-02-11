import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasConfirmComponent } from './listas-confirm.component';

describe('ListasConfirmComponent', () => {
  let component: ListasConfirmComponent;
  let fixture: ComponentFixture<ListasConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
