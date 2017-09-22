let operation = null;
let notificationId = null;
let quotations = [
  "Drinking water is essential to a healthy lifestyle.",
  "The main cause of illness is deficiency of water.",
  "Water is the driving force of all nature.",
  "Stay hydrated and carry on.",
  "Suprise your liver by drinking water."
]
let timeObj = {
  interval: null,
  startTime: null,
  enabled: false
}

window.onload = function () {
  chrome.storage.sync.get(['interval', 'enabled', 'startTime'], function(res) {
    timeObj.startTime = res.startTime
    timeObj.interval = res.interval
    timeObj.enabled = res.enabled
    if (res && res.enabled && res.interval) {
      startOperation(res.interval);
    }
  })
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  chrome.storage.sync.get(['interval', 'enabled', 'startTime'], function(res) {
    timeObj.startTime = res.startTime
    timeObj.interval = res.interval
    timeObj.enabled = res.enabled
    if (changes.enabled && !changes.enabled.newValue && operation !== null) {
      clearInterval(operation);
    }
    if (changes.interval && res && res.enabled) {
      startOperation(res.interval);
    } else if (changes.enabled && changes.enabled.newValue) {
      startOperation(res.interval);
    }
  })
})

chrome.runtime.onMessage.addListener(function(req,sender,sendResponse){
  let intervalInMs = +timeObj.interval * 60 * 1000;
  let endTime = timeObj.startTime + intervalInMs;
  let eT = moment.duration(endTime);
  let cT = moment.duration(Date.now());
  let diff = eT.subtract(cT);
  let diffInMin = diff.get('minutes');
  let diffInSec = diff.get('seconds');
  if (diffInMin < 0 || diffInSec < 0) {
    clearInterval(operation);
    startOperation(timeObj.interval);
    intervalInMs = +timeObj.interval * 60 * 1000;
    endTime = timeObj.startTime + intervalInMs;
    eT = moment.duration(endTime);
    cT = moment.duration(Date.now());
    diff = eT.subtract(cT);
    diffInMin = diff.get('minutes');
    diffInSec = diff.get('seconds');
  }
  let minutes = '' + diffInMin;
  let seconds = '' + diffInSec;
  minutes = (minutes.length === 1)? ('0' + minutes):minutes;
  seconds = (seconds.length === 1)? ('0' + seconds):seconds;
  let time = `${minutes}:${seconds}`;
  sendResponse(time);
});

function startOperation(interval) {
  let dateNow = Date.now(); 
  if (operation !== null) {
    clearInterval(operation);
  }
  let intervalInMs = +interval * 60 * 1000;
  chrome.storage.sync.set({
    startTime: dateNow
  });
  timeObj.startTime = dateNow
  operation = setInterval(function () {
    dateNow = Date.now()
    chrome.storage.sync.set({
      startTime: dateNow
    });
    timeObj.startTime = dateNow
    if (notificationId !== null) {
      chrome.notifications.clear(notificationId);
    }
    let getIndex = Math.floor((Math.random() * 10));
    getIndex = (getIndex > 4) ? (getIndex - 5) : getIndex;
    let message = `Drink up. ${quotations[getIndex]}`
    chrome.notifications.create({
      type: 'basic',
      title: 'Drink Up!',
      message: quotations[getIndex],
      iconUrl: 'images/icon64.png',
      requireInteraction: true
    }, function(id) {
      notificationId = id;
    })
    chrome.tts.speak(message);
  }, intervalInMs);
}
