// 生成器，用来生成迭代器的
// 函数 里面的声明 *  yield 来实现
// 只要遇到yield就会暂停，除非调用.next方法，再继续执行
// function * read(){
//     try{
//         console.log(1); // read() 1 {value: 1, done: false}
//         let a = yield 1  // 产出
//         console.log(2, a); //it.next() 2 undefined
//         let b = yield 2
//         console.log(3, b) // it.next('balabala') 3 "balabala" {value: undefined, done: true}
//     }catch(err){
//         console.log(err);
//     }
// }
// let it = read(); // iterator
// 第一次next传入参数没有任何意义
// console.log(it.next('first'));
// it.throw('出错了'); // 抛出错误 让tryCatch 来捕获

// function * buy(){
//     let a = yield 1;
//     console.log(a);
//     let b = yield 2;
//     console.log(b);
//     return b;
// }
// let it = buy();
// it.next('hello'); // 第一次的next传递参数是无效的
// it.next('world');
// it.next('zf');

// 先读取 name.txt 在读取age.txt

// generator + promise 来使用
let fs = require('fs').promises;

// 生成器，用来生成迭代器的
// const it = read(); * read() 返回值叫迭代器(it)：
// promise 要通过then  generator 可以省略then方法
function* read() {
    // try{
        let content = yield fs.readFile('./name.txt','utf8');
        let age = yield fs.readFile(content,'utf8');
        let a = yield age + 100;
        return a;
    // }catch(err){
    //     console.log(err);
    // }
}
// co 库
// let co = require('co');
// 自己实现一个co库
function co(it){
    // 需要返回一个promise
    return new Promise((resolve,reject)=>{
        // 异步迭代 next
        function next(data){
           let {value,done} = it.next(data);
           if(!done){
               // 包装成Promise
               Promise.resolve(value).then(data=>{
                  next(data)
               },reject);
           }else{
                resolve(value);
           }
        }
        // 第一次next传入参数没有任何意义
        next();
    });
}
co(read()).then(data=>{
    console.log(data);
});

// let it = read();
// let {value,done} = it.next();
// value.then(function(data){
//     let {value,done} = it.next(data);
//     value.then(function(data){
//       let {value,done} = it.next(data);
//       value.then(function(data){
//         let {value,done} = it.next(data);
//         console.log(value);
//       })
//     })
// },function(err){
//     it.throw(err);
// })



// async + await koa + async + await
// react
// 语法糖
// fs的promise版本
let fs = require('fs').promises
// async 相当于 *,await 相当于 yield
// async函数返回的是一个promise
async function read() {
    try{
        // await 后面可以跟一个Promise
        let content = await fs.readFile('./name1.txt','utf8');
        let age = await fs.readFile(content,'utf8');
        // 也可以跟一个普通值
        let r = await 100
        return r;
    }catch(err){
        console.log(err);
    }
}
// async函数返回的是一个promise
// .then写法
read().then(r=>{
    console.log(r); // 100
});

// await 写法
let r = await read();
console.log(r); // 100

// generator-runtime搜索 generator简单实现
// async + await 就是 generator + co 库


// 回调 -> promise -> generator -> async + await



// 作业 1: 柯理化  反柯理化  
// 2) Promise.try()是如何实现的
// https://www.jianshu.com/p/0669749eff8f
// 3） 整理一下 讲过的所有的promise方法
// 练习


