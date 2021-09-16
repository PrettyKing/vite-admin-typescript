/**
 * 函数防抖，一定时间内连续触发事件只执行一次
 * @param: func 需要防抖的函数
 * @param: delay 防抖延迟
 * @param: immediate 是否立即执行,为true表示连续触发时立即执行，即执行一次，为false表示连续触发后delay ms后执行一次
 */
let debounce = function (func, delay = 100, immediate = false) {
    let timeoutId, last, context, args, result;

    function later () {
        const interval = Date.now() - last;
        if (interval < delay && interval >= 0) {
            timeoutId = setTimeout(later, delay - interval);
        } else {
            timeoutId = null;
            if (!immediate) {
                result = func.apply(context, args);
                context = args = null;
            }
        }
    }

    return function () {
        context = this;
        args = arguments;
        last = Date.now();

        if (immediate && !timeoutId) {
            result = func.apply(context, args);
            context = args = null; //解除引用
        }

        if (!timeoutId) {
            timeoutId = setTimeout(later, delay);
        }

        return result;
    };
};


/**
 * 截流:可以理解为事件在一个管道中传输，加上这个节流阀以后，事件的流速就会减慢。
 * 实际上这个函数的作用就是如此，它可以将一个函数的调用频率限制在一定阈值内，
 * 例如 1s，那么 1s 内这个函数一定不会被调用两次
 */
function throttle (fn, wait) {
    let prev = new Date();
    return function () {
        const args = arguments;
        const now = new Date();
        if (now - prev > wait) {
            fn.apply(args);
            prev = new Date();
        }
    };
}


/**
 * 手写一个JS深拷贝
 */
function deepCopy (obj) {
    if (typeof obj == 'object') {
        var result = obj.constructor == Array ? [] : {};
        for (let i in obj) {
            result[i] = typeof obj[i] == 'object' ? deepCopy(obj[i]) : obj[i];
        }
    } else {
        var result = obj;
    }

    return result;
}

/**
 * 2021-1-4
 * 求两个数组的交集
 * @param {*} nums1
 * @param {*} nums2
 */
var intersection = function (nums1, nums2) {
    let set = new Set();
    let map = new Map();

    for (let i = 0; i < nums1.length; i++) {
        map.set(nums1[i], i);
    }

    for (let j = 0; j < nums2.length; j++) {
        if (map.has(nums2[j])) {
            set.add(nums2[j]);
        }
    }
    return [...set];
};

/**
 * 2021-1-5
 * LRU (缓存淘汰算法):Least Recently Used 的缩写，
 * 这种算法认为最近使用的数据是热门数据，下一次很大概率将会再次被使用。
 * 而最近很少被使用的数据，很大概率下一次不再用到。当缓存容量的满时候，优先淘汰最近很少使用的数据。
 *
 * LRU 算法具体步骤
 * - 新数据直接插入到列表头部
 * - 缓存数据被命中，将数据移动到列表头部
 * - 缓存已满的时候，移除列表尾部数据。
 *
 * 以正整数作为容量 capacity 初始化 LRU 缓存
 * @param {*} capacity
 *
 */
function ListNode (key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
}
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.count = 0;
        this.dummy = new ListNode(null, null);
        this.tail = this.dummy;
        this.map = new Map();
    }

    removeHead () {
        this.map.delete(this.dummy.next.key);
        this.dummy.next = this.dummy.next.next;
        if (this.dummy.next !== null) {
            this.dummy.next.prev = this.dummy;
        }
    }
    appendTail (node) {
        this.tail.next = node;
        node.prev = this.tail;
        this.tail = node;
    }
    /**
     * 关键字 key 存在于缓存中，存在返回关键字的值，否则返回 -1
     * @param {*} key
     */
    get (key) {
        if (!this.map.has(key)) {
            return -1;
        }
        let node = this.map.get(key);
        if (node !== this.tail) {
            let prev = node.prev;
            prev.next = node.next;
            prev.next.prev = prev;
            this.appendTail(node);
        }
        return node.value;
    }
    /**
     * 如果关键字已经存在，则变更其数据值；
     *  如果关键字不存在，则插入该组「关键字-值」。
     * 当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。
     * @param {*} key
     * @param {*} value
     */
    put (key, value) {
        let n = new ListNode(key, value);
        if (this.map.has(key)) {
            let node = this.map.get(key);
            if (node !== this.tail) {
                let prev = node.prev;
                prev.next = node.next;
                prev.next.prev = prev;
            } else {
                this.tail = this.tail.prev;
            }
        } else {
            if (this.count < this.capacity) {
                this.count++;
            } else {
                this.removeHead();
            }
        }
        this.appendTail(n);
        this.map.set(key, n);
    }
}


/**
 * 实现一个批量请求函数 multiRequest(urls, maxNum)，要求如下：
 * 要求最大并发数 maxNum
 * 每当有一个请求返回，就留下一个空位，可以增加新的请求
 * 所有请求完成后，结果按照 urls 里面的顺序依次打出复制代码
 */
function multiRequest (urls = [], maxNum) {
    // 请求总数量
    const len = urls.length; // 根据请求数量创建一个数组来保存请求的结果
    const result = new Array(len).fill(false); // 当前完成的数量
    let count = 0;
    return new Promise((resolve, reject) => {
        // 请求maxNum个
        while (count < maxNum) {
            next();
        }
        function next () {
            let current = count++; // 处理边界条件
            if (current >= len) {
                // 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
                !result.includes(false) && resolve(result);
                return;
            }
            const url = urls[current];
            console.log(`开始 ${current}`, new Date().toLocaleString());
            fetch(url)
                .then(res => {
                    // 保存请求结果
                    result[current] = res;
                    console.log(`完成 ${current}`, new Date().toLocaleString()); // 请求没有全部完成, 就递归
                    if (current < len) {
                        next();
                    }
                })
                .catch(err => {
                    console.log(`结束 ${current}`, new Date().toLocaleString());
                    result[current] = err; // 请求没有全部完成, 就递归
                    if (current < len) {
                        next();
                    }
                });
        }
    });
}

/**
 * 2021-07-14
 * 实现retry(func, times, interval)，如果func失败了，会在interval后重试，最大重试次数times（func可能是异步）
 * @param {*} func  绑定函数
 * @param {*} times 请求次数
 * @param {*} interval 延迟时间
 */
const retry = (func, times, interval) => {
    return new Promise(function (resolve, reject) {
        const tFn = function () {
            func().then(resolve).catch(e => {
                if (times-- > 0) {
                    console.log(`还有${times}次`)
                    setTimeout(tFn, interval)
                } else {
                    reject(e)
                }
            })
        }
        return tFn()
    })
}

// test
function getUser () {
    return new Promise((resolve, reject) => {
        const result = Math.floor(Math.random() * 10)
        return result < 3 ? resolve({ id: result, username: 'hello' }) : reject(new Error(`The ${result} is greater than 3`))
    })
}

retry(getUser, 5, 1000).then(r => {
    console.log(`The result is ${r.username}`)
})

/**
 * 2021-07-15
 * 字符串解析，要求相同key的多个值用数组封装如果能用JSON解析则作为json对象没有value，赋值false的boolean值需要转义
 * input: name=adam&name=bob&obj={a:1,b:2}&use&encodeStr=%20
 * output:{
 *      name: ['adam', 'bob'],
 *      obj: {a:1, b:2},
 *      use: false,
 *      encodeStr: ' '
 * }
 */
function getPathValue (str) {
    let arr = decodeURI(str).split("&")
    let map = {}
    let reg = /{.*}/g
    for (const item of arr) {
        let [key, value = false] = item.split("=")
        // TODO: 对象字符串转换对象
        if (reg.test(value)) {
            value = (new Function("return " + value))()
        }
        if (!map[key]) {
            map[key] = value
        } else {
            if (typeof map[key] === 'string') {
                map[key] = [map[key], value]
            } else {
                map[key].push(value)
            }
        }
    }
    return map
}
console.log(getPathValue("name=adam&name=bob&obj={a:1,b:2}&use&encodeStr=%20"))
console.log(getPathValue("name=bob&obj={a:1,b:2}&use&password&name=chalee&encodeStr=%20&name=admin&change=1"))

