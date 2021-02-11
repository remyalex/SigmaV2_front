import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarCreateComponent } from './lugar-create.component';

describe('LugarCreateComponent', () => {
  let component: LugarCreateComponent;
  let fixture: ComponentFixture<LugarCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugarCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugarCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
