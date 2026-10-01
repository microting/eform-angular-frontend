import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs';
import * as Sentry from '@sentry/angular';
import {AuthState, authInitialState} from 'src/app/state/auth/auth.recuder';
import {selectAuth} from 'src/app/state/auth/auth.selector';
import {SentryUserService} from './sentry-user.service';

jest.mock('@sentry/angular', () => ({setUser: jest.fn()}));

const signedIn = (overrides: Partial<AuthState['currentUser']> = {}): AuthState => ({
  ...authInitialState,
  token: {accessToken: 'token', tokenType: 'Bearer', expiresIn: null, role: 'admin'},
  currentUser: {
    ...authInitialState.currentUser,
    id: 7,
    userName: 'jane.doe@example.org',
    firstName: 'Jane',
    lastName: 'Doe',
    ...overrides,
  },
});

describe('SentryUserService', () => {
  let service: SentryUserService;
  let auth$: BehaviorSubject<AuthState>;
  const setUser = Sentry.setUser as jest.Mock;

  beforeEach(() => {
    setUser.mockClear();
    auth$ = new BehaviorSubject<AuthState>(authInitialState);
    const store = {
      select: jest.fn((selector: unknown) => {
        if (selector !== selectAuth) {
          throw new Error('Unexpected selector');
        }
        return auth$;
      }),
    };

    TestBed.configureTestingModule({
      providers: [SentryUserService, {provide: Store, useValue: store}],
    });
    service = TestBed.inject(SentryUserService);
  });

  it('clears the Sentry user while nobody is signed in', () => {
    service.init();

    expect(setUser).toHaveBeenCalledTimes(1);
    expect(setUser).toHaveBeenLastCalledWith(null);
  });

  it('sets the Sentry user when a session appears (login, refresh or restored from storage)', () => {
    service.init();
    auth$.next(signedIn());

    expect(setUser).toHaveBeenLastCalledWith({
      id: 7,
      email: 'jane.doe@example.org',
      username: 'Jane Doe',
    });
  });

  it('falls back to the e-mail as username when the user has no name', () => {
    service.init();
    auth$.next(signedIn({firstName: '', lastName: ''}));

    expect(setUser).toHaveBeenLastCalledWith({
      id: 7,
      email: 'jane.doe@example.org',
      username: 'jane.doe@example.org',
    });
  });

  it('does not set the same user again when unrelated auth state changes', () => {
    service.init();
    auth$.next(signedIn());
    auth$.next({...signedIn(), sideMenuOpened: true});

    expect(setUser).toHaveBeenCalledTimes(2); // initial null + the user
  });

  it('clears the Sentry user on logout', () => {
    service.init();
    auth$.next(signedIn());
    auth$.next(authInitialState);

    expect(setUser).toHaveBeenLastCalledWith(null);
  });
});
