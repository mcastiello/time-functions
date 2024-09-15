import { debounce } from "./debounce";
import { TimingFunctionsParamsBehaviour } from "./types";

describe("debounce", () => {
  const mock = (value: number) => {
    if (!isNaN(value)) return null;
  };
  test("it executes the function after a delay", () => {
    const callback = jest.fn(mock);

    jest.useFakeTimers();

    const debounced = debounce(callback, 250);

    debounced(1);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(250);

    expect(callback).toHaveBeenCalled();

    jest.useRealTimers();
  });
  test("it restarts the delay after each call", () => {
    const callback = jest.fn(mock);

    jest.useFakeTimers();

    const debounced = debounce(callback, 200);

    debounced(1);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    expect(callback).not.toHaveBeenCalled();

    debounced(2);

    jest.advanceTimersByTime(100);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledWith(2);

    jest.useRealTimers();
  });
  test("it triggers the callback with all the parameters ever passed", () => {
    const callback = jest.fn(mock);

    jest.useFakeTimers();

    const debounced = debounce(callback, { delay: 200, behaviour: TimingFunctionsParamsBehaviour.Queue });

    debounced(1);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    debounced(2);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);

    expect(callback).toHaveBeenCalledWith(2, 1);

    jest.useRealTimers();
  });
  test("it triggers the callback with aggregated parameters", () => {
    const callback = jest.fn(mock);

    jest.useFakeTimers();

    const debounced = debounce(callback, {
      delay: 200,
      behaviour: TimingFunctionsParamsBehaviour.Aggregate,
      aggregator: (values: [number][]): [number] => [values.reduce((total, [value]) => total + value, 0)],
    });

    debounced(1);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    debounced(2);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);

    expect(callback).toHaveBeenCalledWith(3);

    jest.useRealTimers();
  });
});
