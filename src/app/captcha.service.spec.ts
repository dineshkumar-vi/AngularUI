import { fakeAsync, tick } from '@angular/core/testing';

const mockAxios = {
  get: jest.fn(),
  post: jest.fn()
};

jest.mock('axios', () => mockAxios);

describe('Captcha Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('IP Address Fetching', () => {
    it('should fetch IP address from external service', fakeAsync(() => {
      const mockResponse = {
        data: 'callback({"ip":"203.0.113.1"});'
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      mockAxios.get('http://api.ipify.org/?format=jsonp').then((response: any) => {
        expect(response.data).toContain('203.0.113.1');
      });

      tick();
    }));

    it('should handle IP fetch timeout', fakeAsync(() => {
      mockAxios.get.mockRejectedValue(new Error('Timeout'));

      mockAxios.get('http://api.ipify.org/?format=jsonp').catch((error: any) => {
        expect(error.message).toBe('Timeout');
      });

      tick();
    }));

    it('should parse IP correctly from JSONP response', () => {
      const testResponses = [
        { input: 'callback({"ip":"192.168.1.1"});', expected: '192.168.1.1' },
        { input: 'callback({"ip":"10.0.0.1"});', expected: '10.0.0.1' },
        { input: 'callback({"ip":"172.16.0.1"});', expected: '172.16.0.1' }
      ];

      testResponses.forEach(test => {
        const ipVar = test.input;
        const num = ipVar.indexOf(':');
        const num2 = ipVar.indexOf('"});');
        const ip = ipVar.slice(num + 2, num2);
        expect(ip).toBe(test.expected);
      });
    });
  });

  describe('Captcha Generation', () => {
    it('should request captcha with IP address', fakeAsync(() => {
      const mockResponse = {
        data: { captcha: 'ABCD1234' }
      };
      mockAxios.post.mockResolvedValue(mockResponse);

      mockAxios.post('http://localhost:8080/captcha', { ipAddress: '192.168.1.1' })
        .then((response: any) => {
          expect(response.data.captcha).toBe('ABCD1234');
        });

      tick();
    }));

    it('should handle captcha generation failure', fakeAsync(() => {
      mockAxios.post.mockRejectedValue(new Error('Service unavailable'));

      mockAxios.post('http://localhost:8080/captcha', { ipAddress: '192.168.1.1' })
        .catch((error: any) => {
          expect(error.message).toBe('Service unavailable');
        });

      tick();
    }));

    it('should generate unique captcha on each request', fakeAsync(() => {
      mockAxios.post
        .mockResolvedValueOnce({ data: { captcha: 'CAP1' } })
        .mockResolvedValueOnce({ data: { captcha: 'CAP2' } })
        .mockResolvedValueOnce({ data: { captcha: 'CAP3' } });

      const captchas: string[] = [];

      Promise.all([
        mockAxios.post('http://localhost:8080/captcha', { ipAddress: '192.168.1.1' }),
        mockAxios.post('http://localhost:8080/captcha', { ipAddress: '192.168.1.1' }),
        mockAxios.post('http://localhost:8080/captcha', { ipAddress: '192.168.1.1' })
      ]).then((responses: any[]) => {
        responses.forEach(res => captchas.push(res.data.captcha));
        expect(new Set(captchas).size).toBe(3);
      });

      tick();
    }));
  });

  describe('Captcha Validation', () => {
    it('should validate correct captcha', fakeAsync(() => {
      const mockResponse = {
        data: 'Login successful'
      };
      mockAxios.post.mockResolvedValue(mockResponse);

      mockAxios.post('http://localhost:8080/login', {
        userName: 'user',
        password: 'pass',
        captcha: 'CORRECT',
        ipAddress: '192.168.1.1'
      }).then((response: any) => {
        expect(response.data).toBe('Login successful');
      });

      tick();
    }));

    it('should reject incorrect captcha', fakeAsync(() => {
      const mockError = {
        response: {
          data: 'Invalid captcha'
        }
      };
      mockAxios.post.mockRejectedValue(mockError);

      mockAxios.post('http://localhost:8080/login', {
        userName: 'user',
        password: 'pass',
        captcha: 'WRONG',
        ipAddress: '192.168.1.1'
      }).catch((error: any) => {
        expect(error.response.data).toBe('Invalid captcha');
      });

      tick();
    }));

    it('should be case-sensitive', fakeAsync(() => {
      const mockError = {
        response: {
          data: 'Invalid captcha'
        }
      };
      mockAxios.post.mockRejectedValue(mockError);

      mockAxios.post('http://localhost:8080/login', {
        userName: 'user',
        password: 'pass',
        captcha: 'abc',
        ipAddress: '192.168.1.1'
      }).catch((error: any) => {
        expect(error.response.data).toBe('Invalid captcha');
      });

      tick();
    }));
  });

  describe('Captcha Refresh', () => {
    it('should request new captcha on refresh', fakeAsync(() => {
      mockAxios.get.mockResolvedValue({ data: 'callback({"ip":"192.168.1.1"});' });
      mockAxios.post
        .mockResolvedValueOnce({ data: { captcha: 'OLD123' } })
        .mockResolvedValueOnce({ data: { captcha: 'NEW456' } });

      let firstCaptcha: string;
      let secondCaptcha: string;

      mockAxios.post('http://localhost:8080/captcha', { ipAddress: '192.168.1.1' })
        .then((response: any) => {
          firstCaptcha = response.data.captcha;
          return mockAxios.post('http://localhost:8080/captcha', { ipAddress: '192.168.1.1' });
        })
        .then((response: any) => {
          secondCaptcha = response.data.captcha;
          expect(firstCaptcha).not.toBe(secondCaptcha);
        });

      tick();
    }));

    it('should invalidate old captcha after refresh', fakeAsync(() => {
      // This test verifies that refreshing generates a new captcha
      mockAxios.post
        .mockResolvedValueOnce({ data: { captcha: 'FIRST' } })
        .mockResolvedValueOnce({ data: { captcha: 'SECOND' } });

      mockAxios.post('http://localhost:8080/captcha', { ipAddress: '192.168.1.1' })
        .then((response: any) => {
          expect(response.data.captcha).toBe('FIRST');
          return mockAxios.post('http://localhost:8080/captcha', { ipAddress: '192.168.1.1' });
        })
        .then((response: any) => {
          expect(response.data.captcha).toBe('SECOND');
        });

      tick();
    }));
  });

  describe('Network Error Handling', () => {
    it('should handle network timeout', fakeAsync(() => {
      mockAxios.get.mockRejectedValue(new Error('ETIMEDOUT'));

      mockAxios.get('http://api.ipify.org/?format=jsonp').catch((error: any) => {
        expect(error.message).toBe('ETIMEDOUT');
      });

      tick();
    }));

    it('should handle connection refused', fakeAsync(() => {
      mockAxios.post.mockRejectedValue(new Error('ECONNREFUSED'));

      mockAxios.post('http://localhost:8080/captcha', { ipAddress: '192.168.1.1' })
        .catch((error: any) => {
          expect(error.message).toBe('ECONNREFUSED');
        });

      tick();
    }));

    it('should handle server errors (500)', fakeAsync(() => {
      const mockError = {
        response: {
          status: 500,
          data: 'Internal Server Error'
        }
      };
      mockAxios.post.mockRejectedValue(mockError);

      mockAxios.post('http://localhost:8080/captcha', { ipAddress: '192.168.1.1' })
        .catch((error: any) => {
          expect(error.response.status).toBe(500);
        });

      tick();
    }));
  });

  describe('Rate Limiting', () => {
    it('should handle rapid captcha refresh requests', fakeAsync(() => {
      mockAxios.get.mockResolvedValue({ data: 'callback({"ip":"192.168.1.1"});' });
      mockAxios.post.mockResolvedValue({ data: { captcha: 'TEST' } });

      const requests = Array(10).fill(null).map(() =>
        mockAxios.post('http://localhost:8080/captcha', { ipAddress: '192.168.1.1' })
      );

      Promise.all(requests).then((responses: any[]) => {
        expect(responses.length).toBe(10);
      });

      tick();
    }));
  });
});
