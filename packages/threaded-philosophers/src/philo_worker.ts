import {isMainThread, parentPort, workerData} from "worker_threads";

const MAX_WAIT = 100;

if (isMainThread) {
  throw "This is not a worker thread";
} else {
  if (parentPort) {
    const { number, sharedBuffer } = workerData;
    const chopsticks = new Uint8Array(sharedBuffer);
    const left = number;
    const right = number === chopsticks.length - 1 ? 0 : number + 1;

    if (!parentPort) throw "Worker has no parent port";

    parentPort.on('message', (data) => {
      const { start } = data;
      if (start) {
        eat(left, right, chopsticks, (msg: string) => {
          parentPort?.postMessage(msg);
        });
      }
    });
  }
}

async function eat(
  left: number, right: number,
  chopsticks: Uint8Array,
  postMessage: (msg: string) => void
) {
  // add delay to force deadlock
  let delay = 0;
  while (true) {
    await waitRandom(); // wait to eat
    const gotLeft = await acquire(left, chopsticks);
    postMessage(`Grabbed ${gotLeft}, need ${right}`);
    // await waitRandom(delay);  // waiting here causes deadlock sooner
    delay += MAX_WAIT / 10;
    const gotRight = await acquire(right, chopsticks);
    postMessage(`Eating with ${gotLeft}/${gotRight}`);
    await waitRandom(); // time to eat
    postMessage(`Releasing ${gotLeft}/${gotRight}`);
    release(left, chopsticks);
    release(right, chopsticks);
  }
}

async function waitRandom(maxTime: number = MAX_WAIT): Promise<void> {
  const randomWait = maxTime * (9 + Math.random()) / 10;
  return new Promise((resolve) =>
    setTimeout(
      () => resolve(),
      randomWait
    )
  );
}

async function acquire(num: number, chopsticks: Uint8Array): Promise<number> {
  return new Promise((resolve) => {
    while(true) {
      // Test-and-set
      if (Atomics.compareExchange(chopsticks, num, 0, 1) === 0) {
        resolve(num);
        return;
      }
      Atomics.pause();
    };
  })
}

function release(num: number, chopsticks: Uint8Array) {
  Atomics.store(chopsticks, num, 0);
}
