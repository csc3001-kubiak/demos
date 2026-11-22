import {isMainThread, parentPort, workerData} from "worker_threads";

if (isMainThread) {
  throw "This is not a worker thread";
} else {
  const { sharedBuffer } = workerData;
  const sharedArray = new Uint32Array(sharedBuffer);

  if (!parentPort) throw "Worker has no parent port";

  parentPort.on('message', (data) => {
    const { number } = data;
    for (let i = 0; i < number; i++) {
      Atomics.add(sharedArray, 0, 1);
    }

    process.exit();
  });

}
