// 观察者模式(观察者和被观察者是有关系的), vue 就是典型的观察者模式，内部创建了很多个watcher 
class Subject{ // 被观察者
    constructor(){
        this.stack = [];
        this.state = '开心';
    }
    attach(observer){
        // 观察者和被观察者中，将观察者放入被观察者中，观察者和被观察者直接进行交互
        this.stack.push(observer);
    }
    setState(newState){
        // 内部做了订阅，只要有更新状态就更新
        this.state = newState;
        // 并且通知观察者
        this.stack.forEach(o=>o.update(newState))
    }
}
class Observer{ // 观察者
    constructor(name){ this.name = name }
    update(newState){
        console.log(this.name+"小宝宝"+newState)
    }
}
let o1 = new Observer('爸爸');
let o2 = new Observer('妈妈');
let s = new Subject('小宝宝');
s.attach(o1);
s.attach(o2);
s.setState('不开心');
