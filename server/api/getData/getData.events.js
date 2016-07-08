/**
 * GetData model events
 */

'use strict';

import {EventEmitter} from 'events';
import GetData from './getData.model';
var GetDataEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
GetDataEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  GetData.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    GetDataEvents.emit(event + ':' + doc._id, doc);
    GetDataEvents.emit(event, doc);
  }
}

export default GetDataEvents;
