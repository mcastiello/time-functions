import { TimedFunction, TimingFunctionsConfig, TimingFunctionsParamsBehaviour } from "./types";
import { runTimingFunction } from "./utils";

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
