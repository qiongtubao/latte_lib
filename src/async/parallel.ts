import eachOf from './eachOf';
import parallel from './internal/parallel';

export default function parallelLimit(tasks: any[], callback) {
    parallel(eachOf, tasks, callback);
}