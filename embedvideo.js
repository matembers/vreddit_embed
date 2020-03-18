//
// Preprocess the supplied url to get the audio/video v.redd.it urls
//
var findSrcUrls = function(url,cb)
{
  //run reddit api request if no v.redd.it link
  $.getJSON("https://www.reddit.com/search/.json",
    {
      "limit":1,
      "q":url
    }, function(data) {
      var audioUrl = "";
      var videoUrl = "";
      
      var dataIsString = typeof data === "string"; //something went wrong

      if (!dataIsString) //expecting a object response
      {
        var posts = null;
        if ($.isArray(data)) //if we have an array response take the first element
        {
          posts = data[0].data; //shouldn't be getting an empty list?
        }
        else
        {
          posts = data.data;
        }
          
        if (posts.children.length > 0)
        {
          var post = posts.children[0].data;
          if (post.domain === "v.redd.it") //ensure v.redd.it post
          {
            var videoData = post.media.reddit_video; //should exist based on domain
            if (videoData.fallback_url.startsWith(url)) //this video url should match
            {
              videoUrl = videoData.fallback_url;
              if (!videoData.is_gif)
              {
                audioUrl = url + "/audio";
              }
            }
          }
        }
      }
      cb({
        video: videoUrl,
        audio: audioUrl,
      });
    });

  return;
}

//
// Simple get url param in js
//
function getParam(param)
{
  var results = new RegExp("[\?&]"+param+"=([^&#]*)")
      .exec(window.location.href);

  if (results && results[1])
  {
    return results[1];
  }

  return "";
}

//
// Very basic attempt to tie video player functions to playing the audio source
//
function tieAudioToVideo(player,src)
{
    var audio = new Audio();
    audio.id = "sound";
    audio.src = src.audio

    player.on("timeupdate", function(d) {
      audio.currentTime = player.currentTime();
    });

    player.on("play", function(d) { audio.play(); });
    player.on("pause", function(d) { audio.pause(); });
    player.on("volumechange", function(d) {
      audio.volume = player.volume();
    });
}

//
// Load the video (and audio) with the source urls
//
function setupVideoAudioPlayer(vid,src)
{
  if (!src.video) return;

  videojs(vid).ready(function () {
    var player = this;
    player.pause();
    player.src({type: 'video/mp4', src: src.video});

    if (src.audio)
    {
      tieAudioToVideo(player,src);
    }
    
    heightbody = $( window ).height()-20;
    player.height(heightbody); 
    player.load();    
    player.play();
  });
}

$(document).ready(function() {
  var vid = "my-video"; //id of video dom object
  var vredditURL = getParam("v");
  if (!vredditURL)
  {
    videojs(vid).ready(function() {
      this.error("Supply the v.redd.it URL in the address bar:\n"+
        window.location.host + window.location.pathname +
        "?v=https://v.redd.it/594vcj9zhbiz"
        );
    });
    return;
  }

  findSrcUrls(vredditURL, function(src) {
    if (!src.video)
    {
      videojs(vid).ready(function() {
        this.error("Bad v.redd.it url or failed to find reddit post:"+vredditURL);
      });
      return;
    }
    setupVideoAudioPlayer(vid,src);
  });
});

