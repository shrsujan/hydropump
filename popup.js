const StorageArea = chrome.storage.sync;
let enableDom = document.getElementById('cb5');

window.onload = function () {
  (function() {
    StorageArea.get(['interval', 'enabled'], function (res) {
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
    });
  })();
  
  document.getElementsByClassName('tgl-btn')[0].addEventListener('click', save);
}

function save() {
  StorageArea.set({
    enabled: !enableDom.checked
  })
}

