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
    chrome.runtime.sendMessage(null, {request: 'getTime'}, function(time) {
      countdownDom.innerText = time;
    })
  }, 1000);
}

function countdownClear() {
  clearInterval(countdown);
  countdownDom.innerText = '00:00';
}

