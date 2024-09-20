import { retry } from "./retry";

describe("retry", () => {
  let counter = 0;
  const delay: number = 5;
  const timeout: number = 50;
  const result: string = "Test";
  const errorMessage = "Error";
  const mock = (returnValue: string, resolveAfter: number = 0): string => {
    if (counter < resolveAfter) {
      counter++;
      throw new Error(errorMessage);
    }
    return returnValue;
  };
  beforeEach(() => {
    counter = 0;
  });
  test("it return the expected value immediately", async () => {
    const callback = jest.fn(mock);

    const retriedCallback = retry(callback);

    const value = await retriedCallback(result);

    expect(value).toEqual(result);
  });
  test("it return the expected value after few retries", async () => {
    const callback = jest.fn(mock);
    const retries: number = 5;

    const retriedCallback = retry(callback, { delay });

    const value = await retriedCallback(result, retries);

    expect(value).toEqual(result);
    expect(callback).toHaveBeenCalledTimes(retries + 1);
  });
  test("it throws an error if it keeps receiving errors within the set timeout", async () => {
    const callback = jest.fn(mock);
    const retries: number = 50;

    const retriedCallback = retry(callback, { delay, timeout });

    try {
      await retriedCallback(result, retries);
    } catch (error) {
      expect((error as Error).message).toEqual(errorMessage);
    }
  });
  test("it throws an error if it the return value doesn't get validated", async () => {
    const callback = jest.fn(mock);
    const validate = jest.fn().mockReturnValue(false);
    const retries: number = 0;

    const retriedCallback = retry(callback, { delay, timeout, validate });

    try {
      await retriedCallback(result, retries);
    } catch (error) {
      expect((error as Error).message).toEqual(`Timeout Error: ${timeout}ms passed without a valid response`);
    }

    expect(validate).toHaveBeenCalledWith(result);
  });
});
