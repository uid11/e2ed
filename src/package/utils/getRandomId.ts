/**
 * Get random id string (request_id) like "2021-04-21T20:24:19.937Z-77xdih8bw7".
 */
export const getRandomId = <T extends string = string>(): T => {
  const randomString = Math.random().toString(36).slice(2, 12).padStart(10, '0');

  return `${new Date().toISOString()}-${randomString}` as T;
};
