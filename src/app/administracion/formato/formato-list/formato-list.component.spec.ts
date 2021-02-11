import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoListComponent } from './formato-list.component';

describe('FormatoListComponent', () => {
  let component: FormatoListComponent;
  let fixture: ComponentFixture<FormatoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
