import localForage from "localforage";
import { debounce, throttle } from 'lodash';

const saveLocalStorageEvents = debounce((_this: any) => {
  const latestMsgs = _this.latestNotesByFollows.eventIds.slice(0, 500).map((eventId: any) => {
    return _this.eventsById.get(eventId);
  });
  const latestMsgsByEveryone = _this.latestNotesByEveryone.eventIds
    .slice(0, 1000)
    .map((eventId: any) => {
      return _this.eventsById.get(eventId);
    });
  const notifications = _this.notifications.eventIds.map((eventId: any) => {
    return _this.eventsById.get(eventId);
  });
  const dms = [];
  for (const set of _this.directMessagesByUser.values()) {
    set.eventIds.forEach((eventId: any) => {
      dms.push(_this.eventsById.get(eventId));
    });
  }
  const kvEvents = Array.from(_this.keyValueEvents.values());

  localForage.setItem('latestMsgs', latestMsgs);
  localForage.setItem('latestMsgsByEveryone', latestMsgsByEveryone);
  localForage.setItem('notificationEvents', notifications);
  localForage.setItem('dms', dms);
  localForage.setItem('keyValueEvents', kvEvents);
  // TODO save own block and flag events
}, 5000);

const saveLocalStorageProfilesAndFollows = debounce((_this) => {
  const profileEvents = Array.from(_this.profileEventByUser.values());
  const myPub = iris.session.getKey().secp256k1.rpub;
  const followEvents = Array.from(_this.followEventByUser.values()).filter((e: Event) => {
    return e.pubkey === myPub || _this.followedByUser.get(myPub)?.has(e.pubkey);
  });
  console.log('saving', profileEvents.length + followEvents.length, 'events to local storage');
  localForage.setItem('profileEvents', profileEvents);
  localForage.setItem('followEvents', followEvents);
}, 5000);