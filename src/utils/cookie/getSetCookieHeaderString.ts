import type {Cookie, SetCookieHeaderString} from '../../types/internal';

/**
 * Get value of set-cookie (response) header string for single cookie by cookie parameters object.
 * @example
 * maps_los=1; expires=Tue, 07-Nov-2023 00:20:49 GMT; path=/; domain=.example.com; Secure; HttpOnly; SameSite=none
 */
export const getSetCookieHeaderString = (cookie: Cookie): SetCookieHeaderString => {
  const {domain, expires, httpOnly, name, path, sameSite, secure, value} = cookie;
  const expiresDate = new Date(expires);
  const maxAge = Math.round((expires - Date.now()) / 1000);

  const cookieStringParts = [
    `${name}=${value}`,
    `Max-Age=${maxAge}`,
    `Path=${path}`,
    `Expires=${expiresDate.toUTCString()}`,
  ];

  if (domain) {
    cookieStringParts.push(`domain=${domain}`);
  }

  if (secure) {
    cookieStringParts.push('Secure');
  }

  if (httpOnly) {
    cookieStringParts.push('HttpOnly');
  }

  cookieStringParts.push(`SameSite=${sameSite}`);

  return cookieStringParts.join('; ') as SetCookieHeaderString;
};