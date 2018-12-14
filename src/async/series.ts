


import parallel from './internal/parallel';
import eachOfSeries from './eachOfSeries';

export default function series(tasks, callback) {
    parallel(eachOfSeries, tasks, callback);
}   