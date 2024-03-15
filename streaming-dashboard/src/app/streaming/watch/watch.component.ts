import {Component, OnDestroy, OnInit} from '@angular/core';
import {VideoPlayerComponent} from "./video-player/video-player.component";
import {VideoPlaylistService} from "../../core/services/video/video-playlist.service";
import {ActivatedRoute} from "@angular/router";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {VideoService} from "../../core/services/video/video.service";

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [
    VideoPlayerComponent,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    MatIcon,
    MatIconButton,
    MatButton
  ],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss'
})
export class WatchComponent implements OnInit, OnDestroy {
  videoUrls = [
    'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
    'https://live-par-1-abr-cdn.livepush.io/live_abr_cdn/emaIqCGoZw-6/index.m3u8',
    'http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8',
    'https://diceyk6a7voy4.cloudfront.net/e78752a1-2e83-43fa-85ae-3d508be29366/hls/fitfest-sample-1_Ott_Hls_Ts_Avc_Aac_16x9_1280x720p_30Hz_6.0Mbps_qvbr.m3u8',
    'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    'https://d1gnaphp93fop2.cloudfront.net/videos/multiresolution/rendition_new10.m3u8',
    'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',

    'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
    'https://live-par-1-abr-cdn.livepush.io/live_abr_cdn/emaIqCGoZw-6/index.m3u8',
    'http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8',
    'https://diceyk6a7voy4.cloudfront.net/e78752a1-2e83-43fa-85ae-3d508be29366/hls/fitfest-sample-1_Ott_Hls_Ts_Avc_Aac_16x9_1280x720p_30Hz_6.0Mbps_qvbr.m3u8',
    'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    'https://d1gnaphp93fop2.cloudfront.net/videos/multiresolution/rendition_new10.m3u8',
    'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',

    'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
    'https://live-par-1-abr-cdn.livepush.io/live_abr_cdn/emaIqCGoZw-6/index.m3u8',
    'http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8',
    'https://diceyk6a7voy4.cloudfront.net/e78752a1-2e83-43fa-85ae-3d508be29366/hls/fitfest-sample-1_Ott_Hls_Ts_Avc_Aac_16x9_1280x720p_30Hz_6.0Mbps_qvbr.m3u8',
    'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    'https://d1gnaphp93fop2.cloudfront.net/videos/multiresolution/rendition_new10.m3u8',
    'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  ];

  name = ''
  url = ''

  constructor(private videoPlaylistService: VideoPlaylistService,
              private activatedRoute: ActivatedRoute,
              private videoService: VideoService
              ) {
  }



  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.paramMap;
    const value = params.get('id');
    if (value && value !== 'url') {
      this.name = value;
      this.url = `http://localhost:8080/hls/${value}.m3u8`
      console.log("Play url ", this.url)
      this.videoPlaylistService.setCurrentVideo(this.url);
    }
    // this.videoPlaylistService.setCurrentVideo('http://localhost:8080/hls/test5.m3u8');
    // this.videoPlaylistService.setCurrentVideo('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8');
  }

  playVideo() {
    this.videoPlaylistService.setCurrentVideo(this.url);
  }

  ngOnDestroy(): void {
    this.videoPlaylistService.destroy()
  }

}
