import Sentry from './Sentry';
import { Claim, Context, Policy, Role } from './types';
import { resolveConditionSubstitutionValues, resolveStringSubstitutionValues } from './utils/context';

export default class Xibolete {
  private _roles: Role[];

  public constructor(roles: Role[]) {
    this._roles = roles;
  }

  public authorizer(claims: Claim, context: Context = {}): Sentry {
    const policies = this._prepareClaimsPolicies(claims, context);

    return new Sentry(policies, context);
  }

  private _prepareClaimsPolicies(claims: Claim, context: Context): Policy[] {
    return claims.roles
      .map((claim) => {
        const claimRole = this._roles.find((role) => role.id === claim.role);

        if (!claimRole)
          return [];

        const valuesMapper = resolveStringSubstitutionValues.bind(null, context),
              conditionsMapper = resolveConditionSubstitutionValues.bind(null, valuesMapper);

        return claimRole.policies.map((policy): Policy => ({
          effect: policy.effect,
          actions: (Array.isArray(policy.actions) ? policy.actions : [ policy.actions ])
            .map(valuesMapper),
          resources: (Array.isArray(policy.resources) ? policy.resources : [ policy.resources ])
            .map(valuesMapper),
          conditions: policy.conditions?.map(conditionsMapper),
        }));
      })
      .reduce<Policy[]>((a, b) => a.concat(b), []);
  }
}
