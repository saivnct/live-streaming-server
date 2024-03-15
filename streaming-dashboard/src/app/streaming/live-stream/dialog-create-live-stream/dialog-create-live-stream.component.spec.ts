import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateLiveStreamComponent } from './dialog-create-live-stream.component';

describe('DialogCreateLiveStreamComponent', () => {
  let component: DialogCreateLiveStreamComponent;
  let fixture: ComponentFixture<DialogCreateLiveStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreateLiveStreamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCreateLiveStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
