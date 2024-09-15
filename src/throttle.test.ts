import { throttle } from "./throttle";
import { TimingFunctionsParamsBehaviour } from "./types";

describe("throttle", () => {
  const mock = (value: number) => {
    if (!isNaN(value)) return null;
  };
  test("it executes the first call immediately", () => {
    const callback = jest.fn(mock);

    jest.useFakeTimers();

    const throttled = throttle(callback, 250);

    throttled(1);

    expect(callback).toHaveBeenCalledWith(1);
  });
  test("it restarts the delay after each call", () => {
    const callback = jest.fn(mock);

    jest.useFakeTimers();

    const throttled = throttle(callback, 200);

    throttled(1);

    expect(callback).toHaveBeenCalledWith(1);

    callback.mockClear();

    throttled(2);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    throttled(3);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    throttled(4);

    expect(callback).toHaveBeenCalledWith(4);

    jest.useRealTimers();
  });
  test("it triggers the callback with all the parameters ever passed", () => {
    const callback = jest.fn(mock);

    jest.useFakeTimers();

    const throttled = throttle(callback, { delay: 200, behaviour: TimingFunctionsParamsBehaviour.Queue });

    throttled(1);

    expect(callback).toHaveBeenCalledWith(1);

    callback.mockClear();

    throttled(2);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    throttled(3);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    throttled(4);

    expect(callback).toHaveBeenCalledWith(4, 3, 2);

    jest.useRealTimers();
  });
  test("it triggers the callback with aggregated parameters", () => {
    const callback = jest.fn(mock);

    jest.useFakeTimers();

    const throttled = throttle(callback, {
      delay: 200,
      behaviour: TimingFunctionsParamsBehaviour.Aggregate,
      aggregator: (values: [number][]): [number] => [values.reduce((total, [value]) => total + value, 0)],
    });

    throttled(1);

    expect(callback).toHaveBeenCalledWith(1);

    callback.mockClear();

    throttled(2);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    throttled(3);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    throttled(4);

    expect(callback).toHaveBeenCalledWith(9);

    jest.useRealTimers();
  });
});
