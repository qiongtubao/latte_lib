import utils from "../utils/index"
import node from './node/index'
let brower = require('./brower/index')
export default utils.isNode ? node : brower;