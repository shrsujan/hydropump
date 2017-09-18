const StorageArea = chrome.storage.sync;
let enableDom = document.getElementById('cb5');
let countdownDom = document.getElementById('countdown');
let countdown = null;

chrome.runtime.connect('connectbackground');
window.onload = function () {
  (function() {
    StorageArea.get(['interval', 'enabled', 'startTime'], function (res) {
      if (res && !res.interval) {
        StorageArea.set({
          interval: '30'
        })
      }
      
      if (res && res.enabled) {
        enableDom.checked = res.enabled;
      } else {
        enableDom.checked = false;
        StorageArea.set({
          enabled: enableDom.checked
        })
      }
      
      if (res && res.startTime && res.enabled) {
        if (countdown !== null) {
          clearInterval();
        }
        countdownTimer();
      }
      
    });
    
  })();
  
  document.getElementsByClassName('tgl-btn')[0].addEventListener('click', save);
}

function save() {
  StorageArea.set({
    enabled: !enableDom.checked
  })
  countdownClear();
  if (!enableDom.checked) {
    countdownTimer();
  }
}

function countdownTimer() {
  countdown = setInterval(function () {
    // StorageArea.get(['interval', 'enabled', 'startTime'], function (res) {
    chrome.runtime.sendMessage(null, {request: 'getTime'}, function(timeObj) {
      let intervalInMs = +timeObj.interval * 60 * 1000;
      let endTime = timeObj.startTime + intervalInMs;
      let eT = moment.duration(endTime);
      let cT = moment.duration(Date.now());
      let diff = eT.subtract(cT);
      let minutes = '' + diff.get('minutes');
      let seconds = '' + diff.get('seconds');
      minutes = (minutes.length === 1)? ('0' + minutes):minutes;
      seconds = (seconds.length === 1)? ('0' + seconds):seconds;
      countdownDom.innerText = `${minutes}:${seconds}`;
      // if (!diff.get('minutes') && !diff.get('seconds')) {
      //   StorageArea.set({
      //     startTime: Date.now()
      //   });
      // }
    })
    // });
  }, 1000);
}

function countdownClear() {
  clearInterval(countdown);
  countdownDom.innerText = '00:00';
}

