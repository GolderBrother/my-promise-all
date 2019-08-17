// 判断数据类型
// typeof instanceof contructor Object.prototype.toString.call 

function isType(type){ // 变量
    return function(content){
        return Object.prototype.toString.call(content) === "[object "+type+"]";
    }
}   
// isString isArray isBoolean
let types = ['String','Boolean','Number','Null','Undefined'];
let utils = {}
for(let type of types) {
    // utils.isString = function 预制参数 和 bind一样
    utils['is'+type] = isType(type);
}
// for(let i = 0 ; i< types.length;i++){
//     let type = types[i]
//     utils['is'+type] = isType(type);
//     // utils.isString = function 预制参数 和 bind一样
// }
let flag = utils.isString('hello');
console.log(flag);

// 如何实现柯理化，反柯理化
// 作业:1
// function fn(a,b,c){
//     return a+b+c;
// }
// function fn(a){
//     return function(b){
//         return function (c){
//             return a+b+c
//         }
//     }
// }
const add = (a,b,c,d,e) => {
    return a + b + c + d + e;
} 

// 实际上是收集参数
const curring = (fn, arr = []) => {
    const len = fn.length;
    return (...args) => {
    	arr = arr.concat(args);
        if(arr.length < len) return curring(fn, arr);
        return fn(...arr);
    }
}

let r = curring(add)(1)(2)(3)(4)(5); // 15


// 偏函数
function fn(a,b){
    return function(c){

    }
}
