import utils from './utils/index'
import events from './events/index'
import async from './async/index'
import format from './format/index'
utils['async'] = async;
utils['events'] = events;
utils['format'] = format;
export default utils;
