/**
 * Define how the parameters passed to the function
 * are treated while the function is being timed
 */
export enum TimingFunctionsParamsBehaviour {
  /**
   * Ignore the parameters of all the times the function is held
   */
  Discard,
  /**
   * All parameters are accumulated and passed to the function as arguments
   */
  Queue,
  /**
   * Let you define a callback function to customise how the parameters are going to be aggregated
   */
  Aggregate,
}

export type TimedFunction = <Args extends never>(...args: Args[]) => void;
export type RetriedFunction = <Args extends never>(...args: Args[]) => unknown;

/**
 * Customise how the parameters are aggregated.
 */
export type AggregatorFunction<Callback extends TimedFunction> = (
  params: Parameters<Callback>[],
) => Parameters<Callback>;

/**
 * Define the delay used by the timed function. You can also specify how the
 * parameters passed to the function are treated while the function is being timed:
 *   Discard: Ignore the parameters of all the times the function is held
 *   Queue: All parameters are accumulated and passed to the function as arguments
 *   Aggregate: Let you define a callback function to customise how the parameters
 *     are going to be aggregated
 */
export type TimingFunctionsConfig<Callback extends TimedFunction> = {
  /**
   * Delay used to hold the callback execution
   */
  delay: number;
  /**
   * Define the behaviour used to accumulate the parameters while the function is held
   */
  behaviour?: TimingFunctionsParamsBehaviour;
  /**
   * Define a custom parameter aggregator
   */
  aggregator?: AggregatorFunction<Callback>;
};

/**
 * Define the delay between each retry (100ms by default) and
 * the maximum timeout after which the function will eventually
 * fail (5s by default).
 * You can provide a function to validate the result, if the return
 * value is not validated, the retry function will keep trying to
 * execute the provided callback.
 */
export type RetryFunctionConfig<Value> = {
  /**
   * Delay between retries (default 100ms)
   */
  delay?: number;
  /**
   * Time after which the retried function throws a timeout error
   */
  timeout?: number;
  /**
   * Define a callback to validate the result value returned by the retried function
   * @param result
   */
  validate?: (result: Value) => boolean;
};
