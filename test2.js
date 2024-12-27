import {and,Input} from "./index.js";

const arrmap = function(n,cb){
    const arr = []
    for(let i = 0; i < n; i++){
        arr.push(cb(i));
    }
    return arr;
}

let res = and(arrmap(3,()=>new Input),arrmap(3,()=>new Input));
console.log(res);


let res2 = and(new Input, new Input);
console.log(res2);

