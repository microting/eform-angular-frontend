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

// Jasmine compatibility layer for Jest
// This provides jasmine global object for existing tests that use Jasmine syntax
(global as any).jasmine = {
  createSpyObj: (baseName: string, methodNames: string[]) => {
    const obj: any = {};
    methodNames.forEach((methodName) => {
      obj[methodName] = jest.fn();
      obj[methodName].and = {
        returnValue: (value: any) => {
          obj[methodName].mockReturnValue(value);
          return obj[methodName];
        },
        throwError: (error: any) => {
          obj[methodName].mockImplementation(() => {
            throw error;
          });
          return obj[methodName];
        }
      };
    });
    return obj;
  },
  createSpy: (name: string, originalFn?: (...args: any[]) => any) => {
    const spy = jest.fn(originalFn as any);
    (spy as any).and = {
      returnValue: (value: any) => {
        spy.mockReturnValue(value);
        return spy;
      },
      callThrough: () => {
        spy.mockImplementation((originalFn || (() => {})) as any);
        return spy;
      }
    };
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



