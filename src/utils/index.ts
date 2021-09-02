/**
 * 判断类型是否为：日期
 * @param val 
 * @returns 
 */
function isDate(val: any): val is Date {
    return toString.call(val) === '[object Date]';
}

/**
 * 判断类型是否为：对象
 * @param val 
 * @returns 
 */
function isObject(val: any): val is Object {
    return val != null && toString.call(val) === '[object Object]';
}

/**
 * 图片上传检测
 */
interface CheckCondition {
    format?: string[];
    size?: number;
  }
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck(file: File, condition: CheckCondition) {
    const { format, size } = condition
    const isValidFormat = format ? format.includes(file.type) : true
    const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
    let error: ErrorType = null
    if (!isValidFormat) {
        error = 'format'
    }
    if (!isValidSize) {
        error = 'size'
    }
    return {
        passed: isValidFormat && isValidSize,
        error
    }
}