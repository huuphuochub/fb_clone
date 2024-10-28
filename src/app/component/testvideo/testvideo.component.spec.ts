import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestvideoComponent } from './testvideo.component';

describe('TestvideoComponent', () => {
  let component: TestvideoComponent;
  let fixture: ComponentFixture<TestvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestvideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
