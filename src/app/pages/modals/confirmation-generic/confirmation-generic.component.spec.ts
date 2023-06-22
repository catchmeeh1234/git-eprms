import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationGenericComponent } from './confirmation-generic.component';

describe('ConfirmationGenericComponent', () => {
  let component: ConfirmationGenericComponent;
  let fixture: ComponentFixture<ConfirmationGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationGenericComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
