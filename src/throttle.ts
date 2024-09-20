import { TimedFunction, TimingFunctionsConfig, TimingFunctionsParamsBehaviour } from "./types";
import { runTimingFunction } from "./utils";

/**
 * Run the function the first time is called, but hold successive
 * executions until the requested delay is reached.
 * @param callback {Function}
 * @param value {number | TimingFunctionsConfig} Pass a number to define a delay, or an object to specify more detailed behaviour.
 */
export const throttle = <Callback extends TimedFunction>(
  callback: Callback,
  value: number | TimingFunctionsConfig<Callback>,
): ((...args: Parameters<Callback>) => void) => {
  const {
    delay,
    behaviour = TimingFunctionsParamsBehaviour.Discard,
    aggregator,
  } = typeof value === "number" ? ({ delay: value } as TimingFunctionsConfig<Callback>) : value;
  const parameters: Parameters<Callback>[] = [];
  let timer: ReturnType<typeof setTimeout> | undefined;

  if (behaviour === TimingFunctionsParamsBehaviour.Aggregate && !aggregator) {
    throw Error("You need to specify an aggregator function");
  }
  return (...args) => {
    parameters.unshift(args);
    if (!timer) {
      try {
        runTimingFunction(callback, parameters, behaviour, aggregator);
      } finally {
        timer = setTimeout(() => {
          timer = undefined;
        }, delay);
        parameters.length = 0;
      }
    }
  };
};
