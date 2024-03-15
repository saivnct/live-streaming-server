import {Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import Hls from "hls.js";
import {VideoService} from "../../../core/services/video/video.service";
import {VideoTimeService} from "../../../core/services/video/video-time.service";
import {VideoPlaylistService} from "../../../core/services/video/video-playlist.service";
import {VolumeService} from "../../../core/services/video/volume.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  loading = true;
  ignore = false;
  playing = false;
  playNext = true;
  private videoEnded = false;

  hlsConfig = {
    enableWorker: true, // use workers
    autoStartLoad: true, // auto play on load
    maxBufferLength: 10, // limit forward buffer
    backBufferLength: 0, // eliminate back buffer
    liveSyncDuration: 3, // how close to live to target? shorter than 3sec causes frequent buffering issues
    liveMaxLatencyDuration: 10, // if higher than this, adjust to liveSyncDuration
    maxLiveSyncPlaybackRate: 2, // if running behind, speed up video
    initialLiveManifestSize: 2, // preload 2 chunks before autostart
    liveDurationInfinity: true, // instructs browser that video is live
    progressive: true, // use fetch instead of xhr
    lowLatencyMode: true, // enable low latency mode
    nudgeMaxRetry: 5, // increase retries before buffer stalled
    testBandwidth: false, // disable auto bandwidth estimation
  }
  private hls = new Hls(this.hlsConfig);

  private videoListeners = {
    loadedmetadata: () => {
      console.log('loadedmetadata with duration', this.video.nativeElement.duration)
      this.videoTimeService.setVideoDuration(this.video.nativeElement.duration)
    },
    canplay: () => {
      console.log('canplay - stop loading animation')
      this.videoService.setLoading(false)
    },
    seeking: () => {
      console.log('seeking - start loading animation')
      this.videoService.setLoading(true)
    },
    timeupdate: () => {
      if (!this.ignore) {
        this.videoTimeService.setVideoProgress(
          this.video.nativeElement.currentTime
        );
      }
      if (
        this.video.nativeElement.currentTime ===
        this.video.nativeElement.duration &&
        this.video.nativeElement.duration > 0
      ) {
        this.videoService.pause();
        this.videoService.setVideoEnded(true);
      } else {
        this.videoService.setVideoEnded(false);
      }
    },
  };

  @ViewChild('video', { static: true }) video: ElementRef<HTMLVideoElement> = {} as ElementRef<HTMLVideoElement>;

  constructor(
    private videoService: VideoService,
    private videoTimeService: VideoTimeService,
    private videoPlaylistService: VideoPlaylistService,
    private volumeService: VolumeService) {
  }

  ngOnInit(): void {
    this.setupPlayer();
    this.subscriptions();
    Object.keys(this.videoListeners).forEach((videoListener) => {
      if (this.video) {
        this.video.nativeElement.addEventListener(
          videoListener,
          this.videoListeners[videoListener as keyof typeof this.videoListeners]
        )
      }
    });

  }

  setupPlayer() {
    this.video.nativeElement.muted = true;
    this.video.nativeElement.autoplay = true;
    this.video.nativeElement.controls = true;
  }

  /** Play/Pause video on click */
  onVideoClick() {
    if (this.playing) {
      this.videoService.pause();
    } else {
      this.videoService.play();
    }
  }

  /** Go full screen on double click */
  onDoubleClick() {
    if (document.fullscreenElement) {
      document.exitFullscreen().then(r => console.log(r));
    } else {
      const videoPlayerDiv = document.querySelector('.video-player');
      if (videoPlayerDiv?.requestFullscreen) {
        videoPlayerDiv.requestFullscreen().then(r => console.log(r));
      }
    }
  }

  /**
   * Loads the video, if the browser supports HLS then the video use it, else play a video with native support
   */
  load(currentVideo: string): void {
    if (Hls.isSupported()) {
      this.loadVideoWithHLS(currentVideo);
    } else {
      if (this.video.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
        this.loadVideo(currentVideo);
      }
    }
  }

  get videoIconPlaying() {
    return this.videoEnded && !this.playNext
      ? {
        name: 'Replay',
        value: 'replay',
      }
      : this.playing
        ? {
          name: 'Pause',
          value: 'pause',
        }
        : {
          name: 'Play',
          value: 'play_arrow',
        };
  }

  /**
   * Play or Pause current video
   */
  private playPauseVideo(playing: boolean) {
    this.playing = playing;
    this.video.nativeElement[playing ? 'play' : 'pause']();
  }

  /**
   * Setup subscriptions
   */
  private subscriptions() {
    this.videoService.playingState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((playing) =>
      this.playPauseVideo(playing)
    );
    this.videoPlaylistService.currentVideo$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((video: string) => {
        if (video) {
          this.load(video)
        }
      }
    );
    this.videoTimeService.currentTime$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (currentTime: number) => (this.video.nativeElement.currentTime = currentTime)
    );
    this.volumeService.volumeValue$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (volume: number) => (this.video.nativeElement.volume = volume)
    );
    this.videoService.videoEnded$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (ended) => (this.videoEnded = ended)
    );
    this.videoService.loading$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((loading) => (this.loading = loading));
    this.videoTimeService.ignore$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((ignore: boolean) => (this.ignore = ignore));
    this.videoPlaylistService.shouldPlayNext$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (playNext: boolean) => (this.playNext = playNext)
    );
  }

  /**
   * Method that loads the video with HLS support
   */
  private loadVideoWithHLS(currentVideo: string) {
    this.hls.loadSource(currentVideo);
    this.hls.attachMedia(this.video.nativeElement);
    this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => console.log('hls manifest:', data.levels[0]));
    this.hls.on(Hls.Events.ERROR, (event, data) => console.error('hls error:', data));
    this.hls.on(Hls.Events.FRAG_BUFFERED, () => console.log('hls fragment', 'position:', Math.round(10 * (this.hls.liveSyncPosition ?? 0)) / 10, 'latency:', Math.round(10 * this.hls.latency) / 10));
    this.hls.on(Hls.Events.MEDIA_ATTACHED, () => () => {
      console.log('hls media attached');
      this.video.nativeElement.play().then(r => console.log(r));
    });
  }

  /**
   * Method that loads the video without HLS support
   */
  private loadVideo(currentVideo: string) {
    this.video.nativeElement.src = currentVideo;
  }


  ngOnDestroy(): void {
    Object.keys(this.videoListeners).forEach((videoListener) => {
      if (this.video) {
        this.video.nativeElement.removeEventListener(
          videoListener,
          this.videoListeners[videoListener as keyof typeof this.videoListeners]
        )
      }
    });

    this.hls.destroy();

  }

}
