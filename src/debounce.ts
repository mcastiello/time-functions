import { TimedFunction, TimingFunctionsConfig, TimingFunctionsParamsBehaviour } from "./types";
import { runTimingFunction } from "./utils";

/**
 * Delay the execution of a function. If while waiting for the execution,
 * the function is called again, the previous call is cancelled and
 * delay is reset. The function will not be executed until the delay
 * is successfully completed without any rest.
 * @param callback {Function}
 * @param value {number | TimingFunctionsConfig} Pass a number to define a delay, or an object to specify more detailed behaviour.
 */
export const debounce = <Callback extends TimedFunction>(
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
    if (timer) {
      clearTimeout(timer);
    }

    parameters.unshift(args);

    timer = setTimeout(() => {
      try {
        runTimingFunction(callback, parameters, behaviour, aggregator);
      } finally {
        timer = undefined;
        parameters.length = 0;
      }
    }, delay);
  };
};
