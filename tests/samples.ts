import { Claim, GeneralPolicyConditionRuleType, PolicyEffect, Role } from '../src/types';

/**
 * This is an illustrative example! Please, **do not** use this type of permissions on
 * your applications.
 */
export const SUDO_PERMISSION: Role = {
  id: 'god-mode-user',
  policies: [
    {
      effect: PolicyEffect.Allow,
      actions: '*',
      resources: '*',
    },
  ],
};

/**
 * Simple permissions to grant a user login access.
 * Notice that **every** context provided to check this permission must include a property
 * 'user' in the object. Otherwise, it will throw an error.
 */
export const OWN_AUTH_PERMISSION: Role = {
  id: 'own-auth',
  policies: [
    {
      effect: PolicyEffect.Allow,
      actions: [
        'auth:GetProfile',
        'auth:GetActivity',
        'auth:UpdatePassword',
      ],
      resources: 'auth:user/{user}',
    },
  ],
};

/**
 * A user with this permissions can manage accounts in witch they are the owners.
 * Notice that **every** context provided to check this permission must include both
 * 'accountOwner' and 'user' properties in the object. Otherwise, it will throw an error.
 */
export const OWN_MONEY_PERMISSION: Role = {
  id: 'own-money',
  policies: [
    {
      effect: PolicyEffect.Allow,
      actions: [
        'account:GetBalance',
        'account:CreateTransfer',
        'account:CreateWithdrawal',
      ],
      resources: 'account:*',
      conditions: [
        {
          type: GeneralPolicyConditionRuleType.StringEquals,
          field: 'account.owner',
          value: '{user}',
        },
      ],
    },
  ],
};

/**
 * An author can write articles, blog posts, product descriptions, etc. But he cannot
 * publish.
 */
export const AUTHOR_PERMISSION: Role = {
  id: 'writer-author',
  policies: [
    {
      effect: PolicyEffect.Allow,
      actions: 'content:*',
      resources: 'content:*',
    },
    {
      effect: PolicyEffect.Deny,
      actions: 'content:Publish*',
      resources: 'content:*',
    },
  ],
};

/**
 * A user with this permissions can manage all content of a system.
 * The only exception is that such user cannot modify (or update) a content that is in a
 * draft stage and does not belong to the user.
 */
export const MANAGER_PERMISSION: Role = {
  id: 'writer-manager',
  policies: [
    {
      effect: PolicyEffect.Allow,
      actions: 'content:*',
      resources: 'content:*',
    },
    {
      effect: PolicyEffect.Deny,
      actions: 'content:Update*',
      resources: 'content:*',
      conditions: [
        {
          allOf: [
            {
              type: GeneralPolicyConditionRuleType.StringEquals,
              field: 'article.status',
              value: 'draft',
            },
            {
              type: GeneralPolicyConditionRuleType.StringNotEquals,
              field: 'article.author',
              value: '{user}',
            },
          ],
        },
      ],
    },
  ],
};

/**
 * HR user can manage everything related to everybody's access to the system.
 */
export const HR_PERMISSION: Role = {
  id: 'hr-manager',
  policies: [
    {
      effect: PolicyEffect.Allow,
      actions: 'auth:*',
      resources: 'auth:*',
    },
  ],
};

/**
 * Financial user can manage payments and rewards for author's work.
 */
export const FINANCIAL_PERMISSION: Role = {
  id: 'financial-manager',
  policies: [
    {
      effect: PolicyEffect.Allow,
      actions: 'account:*',
      resources: 'account:*',
      conditions: [
        {
          anyOf: [
            {
              type: GeneralPolicyConditionRuleType.StringEquals,
              field: 'transaction.type',
              value: 'payment',
            },
            {
              type: GeneralPolicyConditionRuleType.StringEquals,
              field: 'transaction.type',
              value: 'reward',
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Owners can do pretty everything! Since we have HR and financial specific users we can
 * deny owner access to this kind of operations.
 */
export const OWNER_PERMISSION: Role = {
  id: 'owner-manager',
  policies: [
    {
      effect: PolicyEffect.Allow,
      actions: '*',
      resources: '*',
    },
    {
      effect: PolicyEffect.Deny,
      actions: 'account:*',
      resources: 'account:*',
    },
    {
      effect: PolicyEffect.Deny,
      actions: 'auth:*',
      resources: 'auth:*',
      conditions: [
        {
          type: GeneralPolicyConditionRuleType.StringNotEquals,
          field: 'account.owner',
          value: '{user}',
        },
      ],
    },
  ],
};

export const AUTHOR_ID = 'banner-bruce';

export const MANAGER_ID = 'jones-jessica';

export const HR_ID = 'stark-tony';

export const FINANCIAL_ID = 'romanoff';

export const OWNER_ID = 'wilson-sam';

export const AUTHOR_ACCESS: Claim = {
  subject: AUTHOR_ID,
  roles: [
    { role: OWN_AUTH_PERMISSION.id },
    { role: OWN_MONEY_PERMISSION.id },
    { role: AUTHOR_PERMISSION.id },
  ],
};

export const MANAGER_ACCESS: Claim = {
  subject: MANAGER_ID,
  roles: [
    { role: OWN_AUTH_PERMISSION.id },
    { role: OWN_MONEY_PERMISSION.id },
    { role: MANAGER_PERMISSION.id },
  ],
};

export const HR_ACCESS: Claim = {
  subject: HR_ID,
  roles: [
    { role: OWN_AUTH_PERMISSION.id },
    { role: OWN_MONEY_PERMISSION.id },
    { role: HR_PERMISSION.id },
  ],
};

export const FINANCIAL_ACCESS: Claim = {
  subject: FINANCIAL_ID,
  roles: [
    { role: OWN_AUTH_PERMISSION.id },
    { role: OWN_MONEY_PERMISSION.id },
    { role: FINANCIAL_PERMISSION.id },
  ],
};

export const OWNER_ACCESS: Claim = {
  subject: OWNER_ID,
  roles: [
    { role: OWN_AUTH_PERMISSION.id },
    { role: OWN_MONEY_PERMISSION.id },
    { role: OWNER_PERMISSION.id },
  ],
};

export const ALL_ROLES = [
  SUDO_PERMISSION,
  OWN_AUTH_PERMISSION,
  OWN_MONEY_PERMISSION,
  AUTHOR_PERMISSION,
  MANAGER_PERMISSION,
  HR_PERMISSION,
  FINANCIAL_PERMISSION,
  OWNER_PERMISSION,
];

export const AUTHOR_CONTEXT = {
  user: AUTHOR_ID,
  account: {
    id: `${AUTHOR_ID}-account`,
    owner: AUTHOR_ID,
  },
};

export const MANAGER_CONTEXT = {
  user: MANAGER_ID,
  account: {
    id: `${MANAGER_ID}-account`,
    owner: MANAGER_ID,
  },
  article: {
    status: 'pending',
    author: AUTHOR_ID,
  },
};

export const HR_CONTEXT = {
  user: HR_ID,
  account: {
    id: `${HR_ID}-account`,
    owner: HR_ID,
  },
};

export const FINANCIAL_CONTEXT = {
  user: FINANCIAL_ID,
  account: {
    id: `${FINANCIAL_ID}-account`,
    owner: FINANCIAL_ID,
  },
  transaction: {
    type: 'payment',
  },
};

export const OWNER_CONTEXT = {
  user: OWNER_ID,
  account: {
    id: `${OWNER_ID}-account`,
    owner: OWNER_ID,
  },
};
