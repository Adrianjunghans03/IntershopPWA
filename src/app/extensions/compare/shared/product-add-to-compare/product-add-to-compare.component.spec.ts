import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';

import { CompareFacade } from '../../facades/compare.facade';

import { ProductAddToCompareComponent } from './product-add-to-compare.component';

describe('Product Add To Compare Component', () => {
  let component: ProductAddToCompareComponent;
  let fixture: ComponentFixture<ProductAddToCompareComponent>;
  let element: HTMLElement;
  let compareFacade: CompareFacade;

  beforeEach(async () => {
    const context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'addToCompare')).thenReturn(of(true));

    compareFacade = mock(CompareFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(FaIconComponent),
        MockPipe(FeatureTogglePipe, () => true),
        ProductAddToCompareComponent,
      ],
      providers: [
        { provide: CompareFacade, useFactory: () => instance(compareFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToCompareComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show muted button when "isInCompareList" is set to "true"', () => {
    when(compareFacade.inCompareProducts$(anything())).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('button').className).toContain('is-selected');
  });

  it('should show normal button when "isInCompareList" is set to "false"', () => {
    when(compareFacade.inCompareProducts$(anything())).thenReturn(of(false));
    fixture.detectChanges();
    expect(element.querySelector('button').className).toBe('btn add-to-compare');
  });

  it('should not show an icon when display type is not icon', () => {
    fixture.detectChanges();
    expect(element.querySelector('fa-icon')).toBeFalsy();
  });

  it('should show icon button when display type is icon', () => {
    component.displayType = 'icon';
    fixture.detectChanges();
    expect(element.querySelector('fa-icon')).toBeTruthy();
  });

  it('should detect errors on emitter using spy', () => {
    component.toggleCompare();

    verify(compareFacade.toggleProductCompare(anything())).once();
  });
});
