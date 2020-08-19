var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BPK6EiuOHXIeA8Ljsgir1QkjzsgLWH9Rmvj0IRDwYeRkx3gELFSfr6B4Ul4srJBsFRpsc94pGcmrukvkqi4Dk2U",
   "privateKey": "SzNcDrIzSDN7sE03k2PPZRVzjZmnOpVKDqUbLoLQXJc"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/ebX-3gztP84:APA91bEJ80tV-7Xn8WW_mxuDEkHUYamL8Z7pecmHmHDKzn4rMwgORMQcjYPN1_vOl92Rw5Th7QfQcsTxHKAXZpmhVl0wqpv5Pu9iF0Fhm3_2YRhr-yCxsUkQ07GqD79PgJZE3Ybvth6g",
   "keys": {
       "p256dh": "BGCd0TEUxSZxjpp7Cr4wQb1mL7nquY4gDAUBfLm3ccQbNqlbSyQ1Ibdk+8vCkezPr4kjTWi+36R6l6wKvaonSQ8=",
       "auth": "y8tt3vrg3DDRQStXUL0lTw=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '709261571558',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);