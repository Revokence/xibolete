import {
  Context, GeneralPolicyConditionRule, GeneralPolicyConditionRuleType, isConjunctionPolicyConditionAllOf,
  isConjunctionPolicyConditionAnyOf, isGeneralPolicyConditionRule, PolicyCondition,
} from '../types';
import { resolveContextFieldValue } from './context';

export function matchStringPattern(pattern: string | string[], value: string): boolean {
  const patterns = Array.isArray(pattern) ? pattern : [ pattern ];

  return patterns.reduce(
    (memo, string) => {
      if (string.indexOf('*') === -1)
        return memo || string === value;

      const escapedPattern: string = string
        .split(/\*+/)
        .map((piece) => piece === '' ? '' : piece.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('.+');

      return new RegExp(`^${escapedPattern}$`).test(value);
    },
    false as boolean
  );
}

function isSingleSingleConditionSatisfied(condition: PolicyCondition, context: Context): boolean {
  if (isGeneralPolicyConditionRule(condition))
    return matchGeneralConditionRule(condition, context);
  else if (isConjunctionPolicyConditionAllOf(condition))
    return matchConditions(condition.allOf, context);
  else if (isConjunctionPolicyConditionAnyOf(condition))
    return condition.anyOf.some((sub) => isSingleSingleConditionSatisfied(sub, context));

  throw new Error(`Unreachable: ${typeof condition}`);
}

function matchGeneralConditionRule(rule: GeneralPolicyConditionRule, context: Context): boolean {
  const fieldValue = resolveContextFieldValue(context, rule.field);

  switch (rule.type) {
    case GeneralPolicyConditionRuleType.StringEquals: {
      return matchStringPattern(rule.value as string, fieldValue.toString());
    }
    case GeneralPolicyConditionRuleType.StringNotEquals: {
      return !matchStringPattern(rule.value as string, fieldValue.toString());
    }
    case GeneralPolicyConditionRuleType.Bool: {
      return matchStringPattern(rule.value.toString(), fieldValue.toString());
    }
    default: {
      return false;
    }
  }
}

export function matchConditions(conditions: PolicyCondition[], context: Context): boolean {
  if (conditions.length === 0)
    return true;

  return conditions.reduce(
    (memo, condition) => memo && isSingleSingleConditionSatisfied(condition, context),
    true as boolean
  );
}
