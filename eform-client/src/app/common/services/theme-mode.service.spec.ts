import {TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {Appearance, ThemeModeService} from './theme-mode.service';

describe('ThemeModeService', () => {
  const original = (window as any).matchMedia;
  let matches: boolean;
  let listeners: Array<(e: any) => void>;
  let addSpy: ReturnType<typeof vi.fn>;
  let removeSpy: ReturnType<typeof vi.fn>;
  let service: ThemeModeService;

  function stubMatchMedia() {
    addSpy = vi.fn((_t: string, l: any) => { listeners.push(l); });
    removeSpy = vi.fn((_t: string, l: any) => { listeners = listeners.filter(x => x !== l); });
    (window as any).matchMedia = vi.fn(() => ({
      get matches() { return matches; },
      addEventListener: addSpy,
      removeEventListener: removeSpy,
    }));
  }

  beforeEach(() => {
    matches = false;
    listeners = [];
    stubMatchMedia();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeModeService);
  });

  afterEach(() => {
    (window as any).matchMedia = original;
  });

  it('resolve_WithLight_ReturnsLight', () => {
    matches = true;
    expect(service.resolve('light', true)).toBe('light');
  });

  it('resolve_WithDark_ReturnsDark', () => {
    matches = false;
    expect(service.resolve('dark', false)).toBe('dark');
  });

  it('resolve_WithSystem_ReturnsWhatTheMediaQuerySays', () => {
    matches = true;
    expect(service.resolve('system', false)).toBe('dark');
    matches = false;
    expect(service.resolve('system', true)).toBe('light');
  });

  it('resolve_WithSystemAndNoMatchMedia_FallsBackToTheStoredBool', () => {
    (window as any).matchMedia = undefined;
    expect(service.resolve('system', true)).toBe('dark');
    expect(service.resolve('system', false)).toBe('light');
  });

  it('resolve_WithAnUnknownMode_IsTreatedAsSystem', () => {
    matches = true;
    expect(service.resolve('sepia' as any, false)).toBe('dark');
  });

  it('appearance$_EmitsAgainWhenTheMediaQueryChanges', () => {
    const seen: Appearance[] = [];
    service.appearance$.subscribe(a => seen.push(a));
    service.setMode('system');
    service.setMode('system');
    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(seen).toEqual(['light']);
    listeners[0]({matches: true});
    listeners[0]({matches: false});
    expect(seen).toEqual(['light', 'dark', 'light']);
  });

  it('appearance$_DoesNotEmitWhenTheModeIsFixed', () => {
    service.setMode('system');
    service.setMode('dark');
    const seen: Appearance[] = [];
    service.appearance$.subscribe(a => seen.push(a));
    matches = false;
    listeners.forEach(l => l({matches: false}));
    expect(seen).toEqual(['dark']);
  });

  it('setMode_ToFixed_StopsListeningToTheMediaQuery', () => {
    service.setMode('system');
    expect(listeners.length).toBe(1);
    service.setMode('light');
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(listeners.length).toBe(0);
  });
});
