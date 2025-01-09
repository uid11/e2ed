import type {AttributesOptions} from 'create-locator';

/**
 * Attributes options for locators.
 * @internal
 */
export const attributesOptions: AttributesOptions = {
  parameterAttributePrefix: 'data-test-',
  testIdAttribute: 'data-testid',
  testIdSeparator: '-',
};
