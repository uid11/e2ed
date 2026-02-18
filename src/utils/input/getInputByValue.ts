import type {Selector} from '../../types/internal';

/**
 * Get input from multiselector (usually from `<input type="radio">`) by input value.
 */
export const getInputByValue = async (input: Selector, value: string): Promise<Selector | null> => {
  const count = await input.count;

  for (let index = 0; index < count; index += 1) {
    const currentInput = input.nth(index);

    if ((await currentInput.value) === value) {
      return currentInput;
    }
  }

  return null;
};
