// Check Service worker
if (!('serviceWorker' in navigator)) {
    console.log("Service worker not support in this browser.");
  } else {
    registerServiceWorker();
    requestPermission();
  }
  // Register service worker
  function registerServiceWorker() {
    return navigator.serviceWorker.register('service-worker.js')
      .then(function (registration) {
        console.log('Service worker registration is successful.');
        return registration;
      })
      .catch(function (err) {
        console.error('Service worker registration failed.', err);
      });
  }

  function requestPermission() {
  if ('Notification' in window) {
  Notification.requestPermission().then(function (result) {
  if (result === "denied") {
    console.log("Notification feature is not allowed.");
    return;
  } else if (result === "default") {
    console.error("The user closes the permission request dialog box.");
    return;
  }
  
  navigator.serviceWorker.ready.then(() =>{
  if (('PushManager' in window)) {
      navigator.serviceWorker.getRegistration().then(function(registration) {
          registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array("BPK6EiuOHXIeA8Ljsgir1QkjzsgLWH9Rmvj0IRDwYeRkx3gELFSfr6B4Ul4srJBsFRpsc94pGcmrukvkqi4Dk2U")
          }).then(function(subscribe) {
              console.log('Successfully subscribed with endpoints: ', subscribe.endpoint);
              console.log('Successfully subscribed with p256dh key: ', btoa(String.fromCharCode.apply(
                  null, new Uint8Array(subscribe.getKey('p256dh')))));
              console.log('Successfully subscribed with auth key: ', btoa(String.fromCharCode.apply(
                  null, new Uint8Array(subscribe.getKey('auth')))));
          }).catch(function(e) {
              console.error('Unable to subscribe ', e.message);
          });
      });
  }
  })  
          });
        }
  }

  
  function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
  }