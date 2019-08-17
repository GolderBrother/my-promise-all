let Promise = require('./promise');
let fs = require('fs');
let p = new Promise((resolve,reject)=>{ 
    // 读取文件成功后 调用成功 
    throw new Error('出错了');
    fs.readFile('./name.txt','utf8',function(err,data){
        if(err){
            return reject(err); 
        }
        resolve(data);
    })
})
// 每个promise的实例上都有一个then方法
// promise 有多个状态如果成功会让成功的函数 依次执行
// 如果失败会让失败的函数 依次执行
p.then((value)=>{ // fulfilled
    console.log('成功',value);
},(reason)=>{ // rejected
    console.log('失败',reason);
});
// p.then((value)=>{ // fulfilled
//     console.log('成功',value);
// },(reason)=>{ // rejected
//     console.log('失败',reason);
// });

// 笔记
// .then方法里面的逻辑就是收集函数,等待态的时候
//每次调用resolve函数，就存储所有成功的回调
//每次调用reject函数，就存储所有失败的回调
// .then(res => {
//     // 收集依赖
// }, err => {
//     // 收集依赖
// })

// 链式调用
// promise.then方法的返回值
// (1)普通值表示不是Promise，也不是错误
// (2)如果返回promise，这个promise会执行，然后会采用他的状态，并返回给外层的then中
// 成功(resolve态)就走then方法中的成功函数(resolve)
// 失败(reject态 or throw new Error)就走then方法中的失败函数(reject)
// (3).then方法返回的不是this，也就不是之前的promise，所以必须返回一个新的Promise

// 让一个promise变为等待态(pending)
// let p = new Promise(() => {});


// then的链式调用 finnaly all race 测试咱们自己的promise
// generator  co库
// async + await
