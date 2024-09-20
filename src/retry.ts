import { RetriedFunction, RetryFunctionConfig } from "./types";
import { sleep } from "./sleep";

/**
 * Keep retrying to execute the provided function until it returns
 * a valid value without throwing errors, or until the timeout is reached.
 * @param callback {Function}
 * @param [config] {RetryFunctionConfig} Set the delay and timeout of the retried function.
 *   It also lets you define how the results are validated
 */
export const retry = <Callback extends RetriedFunction>(
  callback: Callback,
  config: RetryFunctionConfig<Awaited<ReturnType<Callback>>> = {},
): ((...args: Parameters<Callback>) => Promise<Awaited<ReturnType<Callback>>>) => {
  const { delay = 100, timeout = 5000, validate = () => true } = config;

  return async (...args: Parameters<Callback>): Promise<Awaited<ReturnType<Callback>>> => {
    const timer = Date.now() + timeout;
    let latestError: Error = new Error(`Timeout Error: ${timeout}ms passed without a valid response`);
    while (Date.now() < timer) {
      try {
        const result = (await callback(...args)) as Awaited<ReturnType<Callback>>;
        if (validate(result)) {
          return result;
        }
      } catch (error) {
        if (error instanceof Error) {
          latestError = error;
        }
      }
      await sleep(delay);
    }
    throw latestError;
  };
};
