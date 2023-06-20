function debounce(func, wait, options = {}) {
  let timeoutId;
  let lastArgs;
  let lastThis;
  let result;

  // Retrieve the options or set default values
  const leading = options.leading;
  const trailing = options.trailing;

  const invokeFunc = () => {
    // Invoke the function with the last saved arguments and "this" value
    result = func.apply(lastThis, lastArgs);
    // Clear the arguments and "this" value
    lastArgs = lastThis = undefined;
  };

  const startTimer = () => {
    // Start a new timer using setTimeout
    timeoutId = setTimeout(() => {
      // If trailing is true and there are pending arguments, invoke the function
      if (trailing && lastArgs) {
        invokeFunc();
      }
      // Clear the timer
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }, wait);
  };

  return function debounced(...args) {
    // Save the arguments and "this" value for later use
    lastArgs = args;
    lastThis = this;

    // Clear the existing timer
    clearTimeout(timeoutId);

    if (leading && !timeoutId) {
      // If leading is true and there is no timer, invoke the function immediately
      invokeFunc();
    }

    // Start the timer
    startTimer();

    // Return the result
    return result;
  };
}

function throttle(func, wait, options = {}) {
  let timeoutId;
  let lastArgs;
  let lastThis;
  let result;
  let lastInvokeTime = 0;

  // Retrieve the options or set default values
  const leading = options.leading !== undefined ? options.leading : true;
  const trailing = options.trailing !== undefined ? options.trailing : true;

  const invokeFunc = () => {
    // Invoke the function with the last saved arguments and "this" value
    result = func.apply(lastThis, lastArgs);
    // Clear the arguments and "this" value
    lastArgs = lastThis = undefined;
  };

  return function throttled(...args) {
    const now = Date.now();

    // If leading is true and there's no recent invocation,
    // invoke the function immediately and update the last invoke time
    if (leading && now - lastInvokeTime >= wait) {
      invokeFunc();
      lastInvokeTime = now;
    }

    // If there's no timer yet, start a new one
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = undefined;

        // If trailing is true and there are pending arguments,
        // invoke the function at the end of the throttling period
        if (trailing && lastArgs) {
          invokeFunc();
          lastInvokeTime = Date.now();
        }
      }, wait);
    }

    // Save the arguments and "this" value for the next invocation
    lastArgs = args;
    lastThis = this;

    // Return the result
    return result;
  };
}
