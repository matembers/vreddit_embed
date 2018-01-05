//
// Preprocess the supplied url to get the audio/video v.redd.it urls
//
var findSrcUrls = function(url,cb)
{

  //run reddit api request if no v.redd.it link
  $.getJSON("https://www.reddit.com/search/.json",
    {
      "limit":1,
      "q":"https://v.redd.it/s4vz87dd45801"
    }, function(data) {
      var audio = "";
      var video = "";

            console.log(data);
      if (data.length > 0)
      {
        var posts = data[0].data;
            console.log(posts);
        if (posts.children.length > 0)
        {
          var post = posts.children[0].data;
            console.log(post);
          if (post.domain === "v.redd.it") //ensure v.redd.it post
          {
            var videoData = post.media.reddit_video; //should exist based on domain
            console.log(videoData);
            if (videoData.fallback_url.startsWith(url)) //this video url should match
            {
              video = videoData.fallback_url;
              if (videoData.is_gif)
              {
                audio = url + "/audio";
              }
            }
          }
        }
      }
      cb({
        videoUrl: video,
        audioUrl: audio,
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

$(document).ready(function() {
  
  var vredditURL = getParam("v");
  if (!vredditURL)
  {
    return;
  }

  findSrcUrls(vredditURL, function(src) {
    console.log(src);
  });
  //console.log(srcUrls.videoUrl());
  //console.log(srcUrls.audioUrl());

  videojs('my-video').ready(function () {
    var player = videojs('my-video');
    player.pause();
    console.log(player);
    player.src({type: 'video/mp4', src:"https://v.redd.it/s4vz87dd45801/DASH_9_6_M"}); //https://v.redd.it/594vcj9zhbiz/DASH_4_8_M"});

    var audio = new Audio();
    audio.id = "sound";
    audio.src = "https://v.redd.it/s4vz87dd45801/audio"

    
    player.on("timeupdate", function(d) {
      console.log(player.currentTime());
      audio.currentTime = player.currentTime();
    });

    player.on("play", function(d) { audio.play(); });
    player.on("pause", function(d) { audio.pause(); });
    player.on("volumechange", function(d) {
      audio.volume = player.volume();
    });

    //finally load 
    player.load();
    player.currentTime(2);
    //player.play();
    //audio.play();
    });
});

