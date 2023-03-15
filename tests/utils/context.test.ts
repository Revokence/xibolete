import { Context } from '../../src/types';
import { resolveStringSubstitutionValues } from '../../src/utils/context';

describe('resolveStringSubstitutionValues function', () => {
  function tester(pattern: Context, value: string, expected: string): void {
    const result = resolveStringSubstitutionValues(pattern, value);

    expect(result).toBe(expected);
  }

  it('returns the same value if there are no substitutions', () => {
    tester({ USER: 'nickname' }, 'auth:USER', 'auth:USER');
  });

  it('throws an error if the necessary substitution does not exist', () => {
    const context = { CLIENT: 'nickname' },
          result = (): string => resolveStringSubstitutionValues(context, 'auth:{USER}');

    expect(result).toThrow();
  });

  it('returns the parsed value when only one substitution is provided', () => {
    tester({ USER: 'nickname' }, 'auth:{USER}', 'auth:nickname');
  });

  it('returns the parsed value when only multiple of the same substitution is provided', () => {
    tester({ USER: 'nickname' }, 'auth:manager-{USER}:id-{USER}', 'auth:manager-nickname:id-nickname');
  });

  it('returns the parsed value when only multiple substitutions is provided', () => {
    tester({ USER: 'nick', MANAGER: 'name' }, 'auth:{USER}-{MANAGER}', 'auth:nick-name');
  });

  it('returns the parsed value when using "dot notation" for substitutions', () => {
    const context: Context = { company: { name: 'the-comp' } };

    tester(context, 'auth:{company.name}', 'auth:the-comp');
  });
});
