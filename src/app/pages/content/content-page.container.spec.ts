import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { createContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ContentPageletContainerComponent } from 'ish-shared/cms/containers/content-pagelet/content-pagelet.container';
import { BreadcrumbComponent } from 'ish-shared/common/components/breadcrumb/breadcrumb.component';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { ContentPageContainerComponent } from './content-page.container';

describe('Content Page Container', () => {
  let fixture: ComponentFixture<ContentPageContainerComponent>;
  let component: ContentPageContainerComponent;
  let element: HTMLElement;
  let cmsFacade: CMSFacade;

  const pagelets = {
    pid: {
      displayName: 'pid',
      domain: 'domain',
      definitionQualifiedName: 'fq',
      id: 'pid',
      configurationParameters: {
        HTML: 'foo',
      },
    },
    cmp: {
      displayName: 'cmp',
      domain: 'domain',
      definitionQualifiedName: 'component',
      id: 'cmp',
      configurationParameters: {
        HTML: '<div>test</div>',
      },
    },
  };

  const contentPage = {
    resourceSetId: 'rid',
    domain: 'domain',
    definitionQualifiedName: 'test',
    id: 'id',
    displayName: 'test',
    pageletIDs: [pagelets.pid.id, pagelets.cmp.id],
  };

  beforeEach(async(() => {
    cmsFacade = mock(cmsFacade);
    when(cmsFacade.contentPage$).thenReturn(EMPTY);
    when(cmsFacade.contentPageLoading$).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      declarations: [
        ContentPageContainerComponent,
        MockComponent(BreadcrumbComponent),
        MockComponent(ContentPageletContainerComponent),
        MockComponent(LoadingComponent),
      ],
      imports: [RouterTestingModule],
      providers: [ContentPageContainerComponent, { provide: CMSFacade, useFactory: () => instance(cmsFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading overlay when loading is true', () => {
    when(cmsFacade.contentPageLoading$).thenReturn(of(true));
    fixture.detectChanges();

    expect(findAllIshElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-loading",
      ]
    `);
  });

  it('should render first pagelet of content page when retrieved from facade', () => {
    when(cmsFacade.contentPage$).thenReturn(of(createContentPageletEntryPointView(contentPage, pagelets)));
    fixture.detectChanges();

    expect(findAllIshElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-breadcrumb",
        "ish-content-pagelet",
      ]
    `);

    const child = fixture.debugElement.query(By.css('ish-content-pagelet'))
      .componentInstance as ContentPageletContainerComponent;
    expect(child.pageletId).toMatchInlineSnapshot(`"pid"`);
  });
});
