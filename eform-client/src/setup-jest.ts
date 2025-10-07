// Setup file for Jest
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Ensure Jest matchers are available
// @ts-ignore
if (typeof global.expect === 'undefined') {
  throw new Error('Jest expect is not defined');
}

// Jasmine compatibility layer for Jest
// This provides jasmine global object for existing tests that use Jasmine syntax
(global as any).jasmine = {
  createSpyObj: (baseName: string, methodNames: string[]) => {
    const obj: any = {};
    methodNames.forEach((methodName) => {
      // Create a proper Jest mock function
      const mockFn = jest.fn();
      obj[methodName] = mockFn;
      
      // Add Jasmine-style 'and' API that works with Jest
      Object.defineProperty(obj[methodName], 'and', {
        get: () => ({
          returnValue: (value: any) => {
            mockFn.mockReturnValue(value);
            return mockFn;
          },
          throwError: (error: any) => {
            mockFn.mockImplementation(() => {
              throw error;
            });
            return mockFn;
          },
          callFake: (fn: any) => {
            mockFn.mockImplementation(fn);
            return mockFn;
          }
        }),
        configurable: true
      });
      
      // Add Jasmine-style 'calls' API that doesn't interfere with Jest
      Object.defineProperty(obj[methodName], 'calls', {
        get: () => ({
          reset: () => {
            mockFn.mockClear();
          },
          count: () => {
            return mockFn.mock.calls.length;
          },
          any: () => {
            return mockFn.mock.calls.length > 0;
          },
          all: () => {
            return mockFn.mock.calls;
          },
          mostRecent: () => {
            const calls = mockFn.mock.calls;
            return calls.length > 0 ? { args: calls[calls.length - 1] } : undefined;
          },
          argsFor: (index: number) => {
            return mockFn.mock.calls[index];
          }
        }),
        configurable: true
      });
    });
    return obj;
  },
  createSpy: (name: string, originalFn?: (...args: any[]) => any) => {
    const spy = jest.fn(originalFn as any);
    
    // Add Jasmine-style 'and' API
    Object.defineProperty(spy, 'and', {
      get: () => ({
        returnValue: (value: any) => {
          spy.mockReturnValue(value);
          return spy;
        },
        callThrough: () => {
          spy.mockImplementation((originalFn || (() => {})) as any);
          return spy;
        },
        callFake: (fn: any) => {
          spy.mockImplementation(fn);
          return spy;
        }
      }),
      configurable: true
    });
    
    // Add Jasmine-style 'calls' API
    Object.defineProperty(spy, 'calls', {
      get: () => ({
        reset: () => {
          spy.mockClear();
        },
        count: () => {
          return spy.mock.calls.length;
        },
        any: () => {
          return spy.mock.calls.length > 0;
        },
        all: () => {
          return spy.mock.calls;
        },
        mostRecent: () => {
          const calls = spy.mock.calls;
          return calls.length > 0 ? { args: calls[calls.length - 1] } : undefined;
        },
        argsFor: (index: number) => {
          return spy.mock.calls[index];
        }
      }),
      configurable: true
    });
    
    return spy;
  }
};

// Add custom matchers or global test setup here
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    display: 'none',
    appearance: ['-webkit-appearance']
  })
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});

Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  }
});



