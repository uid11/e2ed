/**
 * Inner key for request type.
 */
declare const REQUEST_KEY: unique symbol;

/**
 * Inner key for response type.
 */
declare const RESPONSE_KEY: unique symbol;

/**
 * Type of inner key for request type.
 */
export type RequestKeyType = typeof REQUEST_KEY;

/**
 * Type of inner key for response type.
 */
export type ResponseKeyType = typeof RESPONSE_KEY;
