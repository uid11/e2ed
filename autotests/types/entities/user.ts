import type {Device} from 'autotests/types';
import type {Brand} from 'e2ed/types';

/**
 * User email.
 */
export type Email = Brand<string, 'Email'>;

/**
 * User language.
 */
export type Language = 'de' | 'en';

/**
 * User password.
 */
export type Password = Brand<string, 'Password'>;

/**
 * User id.
 */
export type UserId = Brand<string, 'UserId'>;

/**
 * API params for user creation.
 */
export type ApiUserParams = Readonly<{
  device: Device;
  email: Email;
  name: string;
  password: Password;
}>;

/**
 * Params for user creation.
 */
export type UserParams = Partial<ApiUserParams>;

/**
 * User phone.
 */
export type UserPhone = Brand<string, 'UserPhone'>;

/**
 * User object.
 */
export type User = Readonly<ApiUserParams & {id: UserId}>;

/**
 * User object returned by API.
 */
export type ApiUser = Omit<User, 'password'>;
