export enum TimingFunctionsParamsBehaviour {
  Discard,
  Queue,
  Aggregate,
}

export type TimedFunction = <Args extends never>(...args: Args[]) => void;

export type AggregatorFunction<Callback extends TimedFunction> = (
  params: Parameters<Callback>[],
) => Parameters<Callback>;

export type TimingFunctionsConfig<Callback extends TimedFunction> = {
  delay: number;
  behaviour?: TimingFunctionsParamsBehaviour;
  aggregator?: AggregatorFunction<Callback>;
};
