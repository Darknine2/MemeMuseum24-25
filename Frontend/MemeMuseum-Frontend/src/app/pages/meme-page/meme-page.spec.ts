import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemePage } from './meme-page';

describe('MemePage', () => {
  let component: MemePage;
  let fixture: ComponentFixture<MemePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
