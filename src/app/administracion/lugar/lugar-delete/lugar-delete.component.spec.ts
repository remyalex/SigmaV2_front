import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarDeleteComponent } from './lugar-delete.component';

describe('LugarDeleteComponent', () => {
  let component: LugarDeleteComponent;
  let fixture: ComponentFixture<LugarDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugarDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugarDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
