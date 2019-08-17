const PENDING = "PENDING";
const SUCCESS = "FULFILLED";
const FAIL = "REJECTED";
// Promise A+ 规范：https://promisesaplus.com/
// 需要来个方法来处理.then方法的返回值
// Promise Resolution Procedure
// resolvePromise
// (1)普通值表示不是Promise，也不是错误,没有返回值(undefined),也算是普通值
// (2)如果返回promise，这个promise会执行，然后会采用他的状态，并返回给外层的then中
// 成功(resolve态)就走then方法中的成功函数(resolve)
// 失败(reject态 or throw new Error)就走then方法中的失败函数(reject)
// (3).then方法返回的不是this，也就不是之前的promise，所以必须返回一个新的Promise
// promise2是.then方法执行完返回的那个新的promise，x 是then方法里面的返回值（上一个Promise的值） 
// 严谨 应该判断 别人的promise 如果失败了就不能在调用成功 如果成功了不能在调用失败

// let obj = {};
// Object.defineProperty(obj, then, {
//     get(){
//     	throw new Error('失败')
//     }
// })

function resolvePromise(promise2, x,resolve,reject) { 
    if(promise2 === x){
       // 自己等自己，死循环
       return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
    }
    let called; // 防止called被调用多次
    if(typeof x === 'function' || (typeof x === 'object' && x !== null)){
      try{    
        // If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason
        let then = x.then;  // then 可能是getter object.defineProperty
        if(typeof then === 'function'){  // {then:null}
           // If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise
           // then.call => x.then()  x.then()方法会再取一次then方法，不太好
           // y => resolve(y) 这里面的y
           then.call(x,y=>{ // 如果是一个promise，就采用这个promise的结果
             if(called) return; // 1) 为了辨别这个promise 不能调用多次
             called = true;
             // If/when resolvePromise is called with a value y, run [[Resolve]](promise, y)
             // y有可能也是个promise,需要实现递归解析，直到y为一个常量，然后直接resolve即可
             resolvePromise(promise2,y,resolve,reject); 
           },r=>{ // r => reject(r),If/when rejectPromise is called with a reason r, reject promise with r.
             // 只要调用失败了，就不用管reject(r) 这里面的r值是否为promise,直接失败
             if(called) return; // 2) 为了辨别这个promise 不能调用多次
             called = true;
             reject(r);
           }) 
        }else{ 
          // 常量不用判断，因为不会再走reject,直接resolve即可
          resolve(x);
        }
      }catch(e){
        if(called) return; // 3) 为了辨别这个promise 不能调用多次
        called = true;
        reject(e);
      }
    }else{
      // 常量不用判断，因为不会再走reject,直接resolve即可
      resolve(x);
    }
}
class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = value => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = SUCCESS;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };
    const reject = reason => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = FAIL;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) { // .catch(function(){}) .then(null,function)
  // 可选参数，如果then方法中的两个函数(参数)有传，就用传入的，没传就用默认的
  onFulfilled = typeof onFulfilled === 'function'?onFulfilled:val=>val;
  onRejected =  typeof onRejected === 'function'?onRejected:err=>{throw err}
    let promise2;
    // 这边 new 的是 自己的 Promise
    promise2 = new Promise((resolve, reject) => {
      if (this.status === SUCCESS) {
        // 加定时器是为了获取 new Promise之后的 promise2 值
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      }
      if (this.status === FAIL) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(()=>{
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        });
        this.onRejectedCallbacks.push(()=> {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    });
    return promise2;
  }
}
// 希望测试一下这个库是否符合我们的promise A+规范
// promises-aplus-tests
Promise.defer = Promise.deferred = function(){
  let dfd = {};
  dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}
module.exports = Promise;
// 全局安装
// npm i promises-aplus-tests -g

// 测试
// promises-aplus-tests myPromise.js

// promise 相关方法
// generator
