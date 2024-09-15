import { AggregatorFunction, TimedFunction, TimingFunctionsParamsBehaviour } from "./types";

export const runTimingFunction = <Callback extends TimedFunction>(
  callback: Callback,
  parameters: Parameters<Callback>[],
  behaviour: TimingFunctionsParamsBehaviour,
  aggregator?: AggregatorFunction<Callback>,
): void => {
  if (parameters.length > 0) {
    switch (behaviour) {
      case TimingFunctionsParamsBehaviour.Discard:
        callback(...(parameters.shift() as Parameters<Callback>));
        break;
      case TimingFunctionsParamsBehaviour.Queue:
        callback(
          ...parameters.reduce(
            (result, value) => [...result, ...value] as Parameters<Callback>,
            [] as unknown as Parameters<Callback>,
          ),
        );
        break;
      case TimingFunctionsParamsBehaviour.Aggregate:
        callback(...(aggregator?.(parameters) as Parameters<Callback>));
        break;
    }
  }
};
