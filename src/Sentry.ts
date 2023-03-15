import { Context, Policy, PolicyEffect } from './types';
import { matchConditions, matchStringPattern } from './utils/matchers';

export default class Sentry {
  private _policies: { allow: Policy[]; deny: Policy[]} = { allow: [], deny: [] };

  private _context: Context = {};

  public constructor(policies: Policy[], context: Context = {}) {
    policies.reduce<Policy[]>((a, b) => a.concat(b), []).forEach((policy) => {
      if (policy.effect === PolicyEffect.Allow)
        this._policies.allow.push(policy);
      else
        this._policies.deny.push(policy);
    });

    this._context = context;
  }

  public allowed(action: string, resource: string): boolean {
    if (this._matchDenyPoliciesPatterns(action, resource))
      return false;

    return this._matchAllowPoliciesPatterns(action, resource);
  }

  private _matchDenyPoliciesPatterns(action: string, resource: string): boolean {
    return this._policies.deny.reduce(
      (memo, policy) => memo || this._matchPolicyStringPatterns(policy, action, resource),
      false
    );
  }

  private _matchAllowPoliciesPatterns(action: string, resource: string): boolean {
    return this._policies.allow.reduce(
      (memo, policy) => memo || this._matchPolicyStringPatterns(policy, action, resource),
      false
    );
  }

  private _matchPolicyStringPatterns(policy: Policy, action: string, resource: string): boolean {
    return matchStringPattern(policy.actions, action)
      && matchStringPattern(policy.resources, resource)
      && matchConditions(policy.conditions || [], this._context);
  }
}
