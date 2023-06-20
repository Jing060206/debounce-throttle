function debounce(func, wait, options) {
  let timeoutId;
  let leadingCall;

  if (typeof options === "object" && options.leading) {
    leadingCall = true;
  }

  return function (...args) {
    const context = this;

    function delayCall() {
      timeoutId = null;

      if (!leadingCall) {
        func.apply(context.args);
      }
    }

    const shouldCallNow = leadingCall && !timeoutId;
    clearTimeout(timeoutId);

    timeoutId = setTimeout(delayCall, wait);

    if (shouldCallNow) {
      func.apply(context, args);
    }
  };
}

function debounce2(func, wait, options = {}) {
  let timeoutId;
  let lastArgs;
  let lastThis;
  let maxTimeoutId;
  let result;
  let lastCallTime = 0;
  const leading = options.leading;
  const maxWait = options.maxWait;
  const trailing = options.trailing;

  const invokeFunc = (time) => {
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastCallTime = time;
    result = func.apply(thisArg, args);
    return result;
  };

  const startTimer = (pendingFunc, wait) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(pendingFunc, wait);
    if (maxWait && !maxTimeoutId) {
      maxTimeoutId = setTimeout(() => {
        invokeFunc(lastCallTime);
      }, maxWait);
    }
  };

  const cancelTimer = () => {
    clearTimeout(timeoutId);
    clearTimeout(maxTimeoutId);
    timeoutId = maxTimeoutId = undefined;
  };

  const leadingEdge = (time) => {
    lastCallTime = time;
    startTimer(timerExpired, wait);
    return leading ? invokeFunc(lastCallTime) : result;
  };

  const remainingWait = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait === undefined
      ? timeWaiting
      : Math.min(timeWaiting, maxWait - timeSinceLastInvoke);
  };

  const shouldInvoke = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  };

  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    startTimer(timerExpired, remainingWait(time));
  };

  const trailingEdge = (time) => {
    clearTimeout(timeoutId);
    clearTimeout(maxTimeoutId);
    timeoutId = maxTimeoutId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  };

  return function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastInvokeTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastInvokeTime);
      }
      if (maxWait !== undefined) {
        clearTimeout(maxTimeoutId);
        maxTimeoutId = setTimeout(() => {
          invokeFunc(lastCallTime);
        }, maxWait);
      }
    }
    startTimer(timerExpired, wait);
    return result;
  };
}

function debounce(func, wait, option = { leading: false, trailing: true }) {
  let timeout;
  let isWaitingForLeading = false;

  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (!isWaitingForLeading && option.leading) {
      func.apply(null, args);
      isWaitingForLeading = true;
    }

    timeout = setTimeout(() => {
      if (option.trailing) {
        func.apply(null, args);
      }
      isWaitingForLeading = false;
    }, wait);
  };
}

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
