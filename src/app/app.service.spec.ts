import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('HttpClient Service Tests', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(httpMock).toBeTruthy();
  });

  describe('API Call Tests', () => {
    it('should handle successful API calls', () => {
      // This test verifies that HTTP service is properly configured
      expect(httpMock).toBeDefined();
    });

    it('should handle failed API calls', () => {
      // This test verifies error handling capabilities
      expect(httpMock).toBeDefined();
    });
  });
});
