import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleMemeComponent } from './handle-meme';

describe('HandleMemeComponent', () => {
  let component: HandleMemeComponent;
  let fixture: ComponentFixture<HandleMemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandleMemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleMemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
