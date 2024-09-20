# Time Functions
A collection of functions that can be used to simplify the asynchronous execution of your code.

### Install
`yarn add @mcastiello/time-functions`

`npm install @mcastiello/time-functions`

## Functions

### `debounce`

Delay the execution of a function. If while waiting for the execution,
the function is called again, the previous call is cancelled and
delay is reset. The function will not be executed until the delay
is successfully completed without any rest.

```ts
import { debounce, sleep } from "@mcastiello/time-functions";

const myFunction = () => console.log("Hello World!");

const debounced = debounce(myFunction, 20);

debounced();
debounced();
debounced();

await sleep(50);
debounced();

// Hello World!
// Hello World!
```
### `debounce`

Delay the execution of a function. If while waiting for the execution,
the function is called again, the previous call is cancelled and
delay is reset. The function will not be executed until the delay
is successfully completed without any rest.

```ts
import { debounce, sleep } from "@mcastiello/time-functions";

const myFunction = () => console.log("Hello World!");

const debounced = debounce(myFunction, 20);

debounced();
debounced();
debounced();

await sleep(50);
// Hello World!

debounced();

// Hello World!
```

### `throttle`

Run the function the first time is called, but hold successive
executions until the requested delay is reached.

```ts
import { throttle, sleep } from "@mcastiello/time-functions";

const myFunction = () => console.log("Hello World!");

const throttled = throttle(myFunction, 20);

throttled();
// Hello World!

throttled();
throttled();

await sleep(50);
throttled();
// Hello World!
```

### `sleep`

Put on hold an asynchronous execution for the requested delay.

```ts
import { sleep } from "@mcastiello/time-functions";

sleep(50).then(() => {
  console.log("Hello World!");
})
```

### `retry`

Keep retrying to execute the provided function until it returns
a valid value without throwing errors, or until the timeout is reached.

```ts
import { retry } from "@mcastiello/time-functions";
import { API_ENDPOINT } from "./constants";

const makeRequest = retry(async (url: string): { valid: boolean } => {
  const response = await fetch(url);
  
  return await response.json();
  
}, {
  delay: 250,
  timeout: 5000,
  validate: (result: { valid: boolean }) => result.valid
});

try {
  console.log(await makeRequest(API_ENDPOINT));
} catch (error) {
  console.error(error);
}
```
