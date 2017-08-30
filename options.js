const StorageArea = chrome.storage.sync;
let intervalDom = document.getElementById('interval');
let enableDom = document.getElementById('enable');

window.onload = function () {
  (function() {
    StorageArea.get(['interval', 'enabled'], function (res) {
      let choices = ['1', '15', '20', '30', '45', '60'];
      if (res && res.interval && choices.indexOf(res.interval) > -1) {
        intervalDom.value = res.interval;
      } else {
        intervalDom.value = '30';
        StorageArea.set({
          interval: intervalDom.value,
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
  
  document.getElementById('save').addEventListener('click', save);
}

function save() {
  StorageArea.set({
    interval: intervalDom.value,
    enabled: enableDom.checked
  })
  window.close();
}

