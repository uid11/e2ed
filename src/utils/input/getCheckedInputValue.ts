import type {Selector} from '../../types/internal';

/**
 * Get checked input value from multiselector (usually from `<input type="radio">`).
 */
export const getCheckedInputValue = async (input: Selector): Promise<string | null> => {
  const count = await input.count;

  for (let index = 0; index < count; index += 1) {
    const currentInput = input.nth(index);

    if (await currentInput.checked) {
      return currentInput.value;
    }
  }

  return null;
};
