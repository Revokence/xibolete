import Sentry from '../src/Sentry';
import { Context, GeneralPolicyConditionRuleType, Policy, PolicyEffect } from '../src/types';

const SAMPLE_POLICIES_OWNER: Policy[] = [
  {
    'effect': PolicyEffect.Allow,
    'actions': [ '*' ],
    'resources': [ '*' ],
  },
  {
    'effect': PolicyEffect.Deny,
    'actions': [
      'content:Update*',
      'content:Delete*',
    ],
    'resources': [
      'content:*',
    ],
  },
  {
    'effect': PolicyEffect.Deny,
    'actions': [
      'auth:UpdatePassword',
      'money:Create*',
    ],
    'resources': [
      'auth:users/nick',
      'money:accounts/the-comp',
    ],
    'conditions': [
      {
        'type': GeneralPolicyConditionRuleType.StringNotEquals,
        'field': 'account.owner',
        'value': 'nick',
      },
    ],
  },
];

describe('Class Sentry', () => {
  function tester(context: Context, action: string, resource: string, expected: boolean): void {
    const result = new Sentry(SAMPLE_POLICIES_OWNER, context);

    expect(result.allowed(action, resource)).toBe(expected);
  }

  describe('allowed method', () => {
    const ownerContext: Context = { account: { owner: 'nick' }, USER: 'nick' },
          otherContext: Context = { account: { owner: 'fury' }, USER: 'nick' };

    it('returns true for authorized user', () => {
      tester(ownerContext, 'money:CreateTransfer', 'money:accounts/the-comp', true);
    });

    it('returns false for unauthorized user', () => {
      tester(otherContext, 'money:CreateTransfer', 'money:accounts/the-comp', false);
    });
  });
});
