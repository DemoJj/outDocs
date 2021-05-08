import './test1.js'

/** @out
 * @description 测试方法
 * @param {string} a 参数一
 * @param {number} b
 */
function square(n) {
    return n * n;
}

/** @out
 * @description 测试方法2
 * @param {string} a
 * @param {number} b
 */
function test(n) {
    return n * n;
}


/** 
 *
 *
 * @param {string} a
 * @returns {void}
 */
function test1(a) {
    return {}
}

/** @out
 *
 *
 * @param {number} [a=3] 
 * @returns
 */
function test12(a=3) {
    return {}
}
