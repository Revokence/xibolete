import Sentry from '../src/Sentry';
import Xibolete from '../src/Xibolete';
import {
  ALL_ROLES, AUTHOR_ACCESS, AUTHOR_CONTEXT, FINANCIAL_ACCESS, FINANCIAL_CONTEXT, HR_ACCESS, HR_CONTEXT, MANAGER_ACCESS,
  MANAGER_CONTEXT, OWNER_ACCESS, OWNER_CONTEXT,
} from './samples';

describe('Class Xibolete', () => {
  const xibolete = new Xibolete(ALL_ROLES);

  function tester(sentry: Sentry, action: string, resource: string, expected: boolean): void {
    expect(sentry.allowed(action, resource)).toBe(expected);
  }

  describe('authorizer method', () => {
    const authorSentry = xibolete.authorizer(AUTHOR_ACCESS, AUTHOR_CONTEXT),
          managerSentry = xibolete.authorizer(MANAGER_ACCESS, MANAGER_CONTEXT),
          hrSentry = xibolete.authorizer(HR_ACCESS, HR_CONTEXT),
          financialSentry = xibolete.authorizer(FINANCIAL_ACCESS, FINANCIAL_CONTEXT),
          ownerSentry = xibolete.authorizer(OWNER_ACCESS, OWNER_CONTEXT);

    it('works as expected for a variety of users and permissions', () => {
      tester(authorSentry, 'auth:GetProfile', `auth:user/${AUTHOR_CONTEXT.user}`, true);
      tester(managerSentry, 'auth:GetProfile', `auth:user/${MANAGER_CONTEXT.user}`, true);
      tester(hrSentry, 'auth:GetProfile', `auth:user/${HR_CONTEXT.user}`, true);
      tester(financialSentry, 'auth:GetProfile', `auth:user/${FINANCIAL_CONTEXT.user}`, true);
      tester(ownerSentry, 'auth:GetProfile', `auth:user/${OWNER_CONTEXT.user}`, true);
    });
  });
});
