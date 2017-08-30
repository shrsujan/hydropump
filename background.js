let operation = null;
let notificationId = null;
let quotations = [
  "Drinking water is essential to a healthy lifestyle.",
  "The main cause of illness is deficiency of water.",
  "Water is the driving force of all nature.",
  "Stay hydrated and carry on.",
  "Suprise your liver by drinking water."
]

window.onload = function () {
  chrome.storage.sync.get(['interval', 'enabled'], function(res) {
    if (res && res.enabled && res.interval) {
      startOperation(res.interval);
    }
  })
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  chrome.storage.sync.get(['interval', 'enabled'], function(res) {
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

function startOperation(interval) {
  if (operation !== null) {
    clearInterval(operation);
  }
  let intervalInMs = +interval * 60 * 1000;
  operation = setInterval(function () {
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
