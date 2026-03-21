import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagField } from './tag-field';

describe('TagField', () => {
  let component: TagField;
  let fixture: ComponentFixture<TagField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
