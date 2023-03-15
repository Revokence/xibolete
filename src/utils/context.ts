import {
  Context, GeneralPolicyConditionRuleType, GeneralPolicyConditionRuleValueType, isConjunctionPolicyConditionAllOf,
  isConjunctionPolicyConditionAnyOf, isGeneralPolicyConditionRule, PolicyCondition,
} from '../types';

export function resolveContextFieldValue(context: Context, field: string): GeneralPolicyConditionRuleValueType {
  function travel(regexp: RegExp): string {
    return String.prototype.split
      .call(field, regexp)
      .filter(Boolean)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), context as any);
  }

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);

  if (result === null || result === undefined)
    throw new Error(`Wrong context: field "${field}" does not exist.`);

  return result;
}

export function resolveStringSubstitutionValues(context: Context, value: string): string {
  const substitutions = value.match(/[^{}]+(?=})/g);

  if (!substitutions)
    return value;

  // We simply use resolveContextFieldValue to throw an error if some required
  // context field does not exist!
  substitutions.forEach((key) => {
    value = value.replace(new RegExp(`{${key}}`, 'g'), resolveContextFieldValue(context, key).toString());
  });

  return value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Resolver = (value: any) => GeneralPolicyConditionRuleValueType

export function resolveConditionSubstitutionValues(resolver: Resolver, condition: PolicyCondition): PolicyCondition {
  if (isGeneralPolicyConditionRule(condition)) {
    switch (condition.type) {
      case GeneralPolicyConditionRuleType.Bool: {
        return condition;
      }
      default: {
        return {
          type: condition.type,
          field: condition.field,
          value: resolver(condition.value),
        };
      }
    }
  }
  else if (isConjunctionPolicyConditionAllOf(condition)) {
    return {
      allOf: condition.allOf.map((sub) => resolveConditionSubstitutionValues(resolver, sub)),
    };
  }
  else if (isConjunctionPolicyConditionAnyOf(condition)) {
    return {
      anyOf: condition.anyOf.map((sub) => resolveConditionSubstitutionValues(resolver, sub)),
    };
  }

  throw new Error(`Unreachable: ${typeof condition}`);
}
