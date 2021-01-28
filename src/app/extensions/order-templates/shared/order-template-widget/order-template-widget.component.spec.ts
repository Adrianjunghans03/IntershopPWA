import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';

import { OrderTemplateWidgetComponent } from './order-template-widget.component';

describe('Order Template Widget Component', () => {
  let component: OrderTemplateWidgetComponent;
  let fixture: ComponentFixture<OrderTemplateWidgetComponent>;
  let element: HTMLElement;
  let orderTemplatesFacade: OrderTemplatesFacade;

  const orderTemplates = [
    { id: '1', title: 'order template' },
    { id: '2', title: 'order template 2' },
  ] as OrderTemplate[];

  beforeEach(async () => {
    orderTemplatesFacade = mock(OrderTemplatesFacade);
    when(orderTemplatesFacade.orderTemplates$).thenReturn(of(orderTemplates));
    when(orderTemplatesFacade.addOrderTemplateToBasket(anything())).thenReturn();
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(InfoBoxComponent),
        MockComponent(LoadingComponent),
        MockComponent(ProductAddToBasketComponent),
        OrderTemplateWidgetComponent,
      ],
      providers: [{ provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTemplateWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if order templates are loading', () => {
    when(orderTemplatesFacade.orderTemplateLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render order template list after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('.loading-container').textContent.trim()).toMatchInlineSnapshot(
      `"order template  order template 2"`
    );
  });

  it('should trigger add product to basket with right order template', () => {
    expect(() => fixture.detectChanges()).not.toThrow();

    component.addTemplateToBasket(orderTemplates[1]);

    verify(orderTemplatesFacade.addOrderTemplateToBasket(anything())).once();
    expect(capture(orderTemplatesFacade.addOrderTemplateToBasket).last()).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "2",
          "title": "order template 2",
        },
      ]
    `);
  });
});
