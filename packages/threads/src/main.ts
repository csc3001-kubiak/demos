import { Worker, isMainThread } from "worker_threads";

const WORKER_FILE = "./dist/worker.js"; // <-- Note: Must be JS file

if (isMainThread) {
  const worker = new Worker(WORKER_FILE);
  let done = false;

  // Listen for messages from the worker
  worker.on('message', (result) => {
    console.log('Received result:', result);
  });

  // Handle worker errors
  worker.on('error', (error) => {
    console.error('Worker error:', error);
  });

  // Handle worker completion
  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
    done = true;
  });

  // Send data to the worker
  worker.postMessage({ number: 45 });

  let seconds = 0;
  const timer = setInterval(() => {
    if (done) {
      clearInterval(timer);
      console.log(`Done in ${seconds} seconds`);
      process.exit();
    } else {
      seconds += 1;
      console.log(`${seconds} seconds`);
    }
  }, 1000);

} else {
  throw "This is not the main thread";
}
