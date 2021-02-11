import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasCreateComponent } from './listas-create.component';

describe('ListasCreateComponent', () => {
  let component: ListasCreateComponent;
  let fixture: ComponentFixture<ListasCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
