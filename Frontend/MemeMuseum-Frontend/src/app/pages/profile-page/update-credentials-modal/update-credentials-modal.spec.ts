import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCredentialsModal } from './update-credentials-modal';

describe('UpdateCredentialsModal', () => {
  let component: UpdateCredentialsModal;
  let fixture: ComponentFixture<UpdateCredentialsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCredentialsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCredentialsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
