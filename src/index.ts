import utils from './utils/index'
import events from './events/index'
import async from './async/index'
import format from './format/index'
import xhr from './xhr/index'
import promise from './promise/index'
import object from './object/index'
utils['async'] = async;
utils['events'] = events;
utils['format'] = format;
utils['xhr'] = xhr;
utils['promise'] = promise;
utils['object'] = object;
export default utils;
