export enum PolicyEffect {
  Allow = 'Allow',
  Deny = 'Deny'
}

export enum GeneralPolicyConditionRuleType {
  StringEquals = 'string-equals',
  StringNotEquals = 'string-not-equals',
  Bool = 'bool'
}

export type GeneralPolicyConditionRuleValueType = string | boolean

export interface GeneralPolicyConditionRule {
  type: GeneralPolicyConditionRuleType;
  field: string;
  value: GeneralPolicyConditionRuleValueType;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isGeneralPolicyConditionRule(obj: any): obj is GeneralPolicyConditionRule {
  return obj
    && (obj.field !== null && obj.field !== undefined && typeof obj.field.valueOf() === 'string')
    && Object.getOwnPropertyNames(obj).includes('value')
    && Object.values(GeneralPolicyConditionRuleType).includes(obj.type);
}

export type ConjunctionPolicyConditionRule = ConjunctionPolicyConditionAllOf | ConjunctionPolicyConditionAnyOf

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isConjunctionPolicyConditionRule(obj: any): obj is ConjunctionPolicyConditionAllOf {
  return isConjunctionPolicyConditionAllOf(obj) || isConjunctionPolicyConditionAnyOf(obj);
}

export type PolicyCondition = GeneralPolicyConditionRule | ConjunctionPolicyConditionRule

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPolicyCondition(obj: any): obj is PolicyCondition {
  return isGeneralPolicyConditionRule(obj) || isConjunctionPolicyConditionRule(obj);
}

export type ConjunctionPolicyConditionAllOf = {
  allOf: PolicyCondition[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isConjunctionPolicyConditionAllOf(obj: any): obj is ConjunctionPolicyConditionAllOf {
  return Array.isArray(obj.allOf)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    && (obj.allOf as any[]).reduce((memo, condition) => memo && isPolicyCondition(condition), true);
}

export type ConjunctionPolicyConditionAnyOf = {
  anyOf: PolicyCondition[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isConjunctionPolicyConditionAnyOf(obj: any): obj is ConjunctionPolicyConditionAnyOf {
  return Array.isArray(obj.anyOf)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    && (obj.anyOf as any[]).reduce((memo, condition) => memo && isPolicyCondition(condition), true);
}

export interface Policy {
  id?: string;
  effect: PolicyEffect;
  actions: string | string[];
  resources: string | string[];
  conditions?: PolicyCondition[];
}

export interface Role {
  id: string;
  policies: readonly Policy[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Context = Record<string, any>

export interface RoleClaim {
  role: string;
  context?: Context;
}

export interface Claim {
  subject: string;
  roles: readonly RoleClaim[];
}
