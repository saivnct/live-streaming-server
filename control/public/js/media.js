console.log("play stream for",streamName, streamUrl);

const video = document.getElementById("video");

if (Hls.isSupported()) {
  const hls = new Hls();
  hls.loadSource(streamUrl);
  hls.attachMedia(video);
} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
  video.src = streamUrl;
}