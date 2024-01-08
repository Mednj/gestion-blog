import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BloggerService } from '../service/blogger.service';

import { BloggerComponent } from './blogger.component';

describe('Blogger Management Component', () => {
  let comp: BloggerComponent;
  let fixture: ComponentFixture<BloggerComponent>;
  let service: BloggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'blogger', component: BloggerComponent }]),
        HttpClientTestingModule,
        BloggerComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(BloggerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BloggerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BloggerService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.bloggers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to bloggerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBloggerIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBloggerIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
