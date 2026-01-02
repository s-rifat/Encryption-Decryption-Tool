import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayfairCipherComponent } from './playfair-cipher.component';

describe('PlayfairCipherComponent', () => {
  let component: PlayfairCipherComponent;
  let fixture: ComponentFixture<PlayfairCipherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayfairCipherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayfairCipherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
