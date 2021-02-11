import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarListComponent } from './lugar-list.component';

describe('LugarListComponent', () => {
  let component: LugarListComponent;
  let fixture: ComponentFixture<LugarListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugarListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
