import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBlogger } from '../blogger.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../blogger.test-samples';

import { BloggerService } from './blogger.service';

const requireRestSample: IBlogger = {
  ...sampleWithRequiredData,
};

describe('Blogger Service', () => {
  let service: BloggerService;
  let httpMock: HttpTestingController;
  let expectedResult: IBlogger | IBlogger[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BloggerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Blogger', () => {
      const blogger = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(blogger).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Blogger', () => {
      const blogger = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(blogger).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Blogger', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Blogger', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Blogger', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBloggerToCollectionIfMissing', () => {
      it('should add a Blogger to an empty array', () => {
        const blogger: IBlogger = sampleWithRequiredData;
        expectedResult = service.addBloggerToCollectionIfMissing([], blogger);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blogger);
      });

      it('should not add a Blogger to an array that contains it', () => {
        const blogger: IBlogger = sampleWithRequiredData;
        const bloggerCollection: IBlogger[] = [
          {
            ...blogger,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBloggerToCollectionIfMissing(bloggerCollection, blogger);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Blogger to an array that doesn't contain it", () => {
        const blogger: IBlogger = sampleWithRequiredData;
        const bloggerCollection: IBlogger[] = [sampleWithPartialData];
        expectedResult = service.addBloggerToCollectionIfMissing(bloggerCollection, blogger);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blogger);
      });

      it('should add only unique Blogger to an array', () => {
        const bloggerArray: IBlogger[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bloggerCollection: IBlogger[] = [sampleWithRequiredData];
        expectedResult = service.addBloggerToCollectionIfMissing(bloggerCollection, ...bloggerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const blogger: IBlogger = sampleWithRequiredData;
        const blogger2: IBlogger = sampleWithPartialData;
        expectedResult = service.addBloggerToCollectionIfMissing([], blogger, blogger2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blogger);
        expect(expectedResult).toContain(blogger2);
      });

      it('should accept null and undefined values', () => {
        const blogger: IBlogger = sampleWithRequiredData;
        expectedResult = service.addBloggerToCollectionIfMissing([], null, blogger, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blogger);
      });

      it('should return initial array if no Blogger is added', () => {
        const bloggerCollection: IBlogger[] = [sampleWithRequiredData];
        expectedResult = service.addBloggerToCollectionIfMissing(bloggerCollection, undefined, null);
        expect(expectedResult).toEqual(bloggerCollection);
      });
    });

    describe('compareBlogger', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBlogger(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBlogger(entity1, entity2);
        const compareResult2 = service.compareBlogger(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBlogger(entity1, entity2);
        const compareResult2 = service.compareBlogger(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBlogger(entity1, entity2);
        const compareResult2 = service.compareBlogger(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
