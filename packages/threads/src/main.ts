import { Worker, isMainThread } from "worker_threads";

const WORKER_FILE = "./dist/counter_worker.js"; // <-- Note: Must be JS file
const WORKER_COUNT = 2;

if (isMainThread) {
  // Create a shared buffer that can be accessed by all threads
  const sharedBuffer = new SharedArrayBuffer(4 /* bytes */);
  const sharedArray = new Uint32Array(sharedBuffer);
  let workers: Worker[] = [];

  while (workers.length < WORKER_COUNT) {
    // Start a worker
    const worker = new Worker(WORKER_FILE, {
        workerData: { sharedBuffer }
    });
    workers.push(worker);

    // Handle worker errors
    worker.on('error', (error) => {
      console.error('Worker error:', error);
    });

    // Handle worker completion
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
      workers = workers.filter((w) => w !== worker);
    });
  }

  let seconds = 0;
  const timer = setInterval(() => {
    if (workers.length > 0) {
      seconds += 1;
      console.log(`${seconds} seconds`);
    } else {
      clearInterval(timer);
      console.log(`Done in ${seconds} seconds`);
      console.log("Final counter value:", sharedArray[0]);
      process.exit();
    }
  }, 1000);

  // Start the workers counting
  workers.forEach((w, i) => {
    w.postMessage({ number: 10000000 });
    console.log("Started worker ", i);
  });
} else {
  throw "This is not the main thread";
}
