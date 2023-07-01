const video = document.getElementById("webcam");
const classifier = knnClassifier.create();
let net;

async function setupWebcam() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      video.width = video.videoWidth;
      video.height = video.videoHeight;
      resolve(video);
    };
  });
}

async function captureExample(classId) {
  const activation = net.infer(video, "conv_preds");
  classifier.addExample(activation, classId);
}

async function predict() {
  if (classifier.getNumClasses() > 0) {
    const activation = net.infer(video, "conv_preds");
    const result = await classifier.predictClass(activation);
    document.getElementById("console").innerText = result.label;
  }
  requestAnimationFrame(predict);
}

async function run() {
  console.log("Loading mobilenet..");
  net = await mobilenet.load();
  console.log("Loaded mobilenet");
  await setupWebcam();
  document
    .getElementById("class-a")
    .addEventListener("click", () => captureExample(0));
  document
    .getElementById("class-b")
    .addEventListener("click", () => captureExample(1));
  document
    .getElementById("class-c")
    .addEventListener("click", () => captureExample(2));
  predict();
}

run();
