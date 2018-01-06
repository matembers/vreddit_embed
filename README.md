# Outline

Needed a simple solution for embedding v.redd.it when pulling posts from the reddit API.

The important fields in the post reddit object are `fallback_url` and `is_gif`. 
* `fallback_url` should point to one of the video sources for the v.redd.it video.
* `is_gif` indicates if there is audio associated with the video.

The html video element then points to the `fallback_url` source url and if `is_gif` is false then an audio element is created and points to `fallback_url/../audio`.

Finally, Volume, play/pause and seek events from the video element are pushed to the audio element such that both the audio and video are in synch.

Note Video.js is used purely because it shows a mute button/volume slider even when the underlying video source does not have an audio stream. 

# Examples

## Video
TODO

## Gif
<a href="https://m-mullins.github.io/vreddit_embed/?v=https://v.redd.it/fxc6a56wrb801" target="_blank"><img src="https://b.thumbs.redditmedia.com/OZuSnzCHT1f1nQVy-6SoCt9sLoeZZhNJAvDKVr6DBwg.jpg" alt="gif test" width="240" height="180" border="10" /></a>
