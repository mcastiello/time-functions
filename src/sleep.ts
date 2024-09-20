/**
 * Put on hold an asynchronous execution for the requested delay.
 * @param delay {number}
 */
export const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
