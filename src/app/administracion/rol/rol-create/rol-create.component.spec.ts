import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolCreateComponent } from './rol-create.component';

describe('RolCreateComponent', () => {
  let component: RolCreateComponent;
  let fixture: ComponentFixture<RolCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
