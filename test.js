import {and,or,not,High,Low,Input} from "./index.js";

const repeat = function(r,n){
    let arr = [];
    for(let i = 0; i < n; i++){
        arr.push(r);
    }
    return arr;
};

const arrmap = function(n,cb){
    let arr = [];
    for(let i = 0; i < n; i++){
        arr.push(cb(i));
    }
    return arr;
};

const setArray = function(arr1,arr2,idx){
    for(let i = 0; i < arr2.length; i++){
        arr1[idx+i] = arr2[i];
    }
};

const xor = function(a,b){
    let an = not(a);
    let bn = not(b);
    return or(and(a,bn),and(an,b));
};

const fullAdd = function(a,b,c){
    let xorab = xor(a,b);
    // digit, carry
    return [xor(xorab,c),or(and(a,b),and(xorab,c))];
};

const add = function(arr1,arr2){
    let out = [];
    let carry = Low;
    for(let i = 0; i < arr1.length; i++){
        let digit;
        [digit,carry] = fullAdd(arr1[i],arr2[i],carry);
        out.push(digit);
    }
    out.push(carry);
    return out;
};

const andarr = function(arr,flag){
    let out = [];
    for(let gate of arr){
        out.push(and(gate,flag));
    }
    return out;
}

const mul = function(arr1,arr2){
    let out = repeat(Low,arr1.length+arr2.length);
    for(let i = 0; i < arr2.length; i++){
        let res = add(andarr(arr1,arr2[i]),out.slice(i,i+arr1.length));
        setArray(out,res,i);
    }
    return out;
}

const floatMul = function(arr1,arr2){
    let sign = xor(arr1[31],arr2[31]);
    let exp1 = arr1.slice(23,31);
    let exp2 = arr2.slice(23,31);
    let frac1 = arr1.slice(0,23);
    let frac2 = arr2.slice(0,23);
    let exp11 = and(...exp1);
    let exp12 = and(...exp2);
    let frac01 = not(or(...frac1));
    let frac02 = not(or(...frac2));
    let inf1 = and(exp11,frac01);
    let inf2 = and(exp12,frac02);
    let NaN1 = and(exp11,not(frac01));
    let NaN2 = and(exp12,not(frac02));
    let sub1 = not(or(...exp1));
    let sub2 = not(or(...exp2));


    // normalizing fraction and exponent
    frac1 = [not(sub1),...frac1];
    frac2 = [not(sub2),...frac2];
    exp1[0] = or(sub1,exp1[0]);
    exp2[0] = or(sub2,exp2[0]);
    let res = mul(frac1,frac2);
    // check how many zeros on the right res has
    // Oh boy it's about to get expensive
    // 48 bit product, 47 casesto handle
    let frac = arrmap(23,()=>[]);
    let mexp = arrmap(9,()=>[]);
    for(let i = res.length-1; i >= 0; i--){
        let isActive = and(i,...res.slice(i+1));
        let f = res.slice(0,i).reverse().slice(0,23);
        if(let j = f.length; j < 23; j++){
            f.push(Low);
        }
        f = f.reverse().map(v=>and(v,isActive));
        for(let j = 0; j < 23; j++){
            frac[j].push(f[j]);
        }
        let exp = intToBits(-(res.length-i)+1).slice(0,9);
        for(let j = 0; j < 9; j++){
            mexp[j].push(and(exp[j],isActive));
        }
    }
    frac = frac.map(v=>or(...v));
    // calculate the exp
    let exp = add(add(exp1,exp2),mexp.map(v=>or(v))).slice(0,9);
    let normalAnswer = [...frac,...exp.slice(0,8)].map(v=>and(v,exp[8]));
    // 
}






//test multiplication

const darr = new Float64Array(1);
const farr = new Float32Array(darr.buffer);
const iarr = new Int32Array(darr.buffer);
const barr = new Uint8Array(darr.buffer);

const bytesToBits = function(bytes){
    const arr = [];
    for(let i = 0; i < bytes.length; i++){
        for(let j = 0; j < 8; j++){
            arr.push((bytes[i]>>>j)&1);
        }
    }
    return arr;
};

const doubleToBits = function(n){
    darr[0] = n;
    return bytesToBits(barr.slice(0,8));
};

const floatToBits = function(n){
    farr[0] = n;
    return bytesToBits(barr.slice(0,4));
};

const intToBits = function(n){
    iarr[0] = n;
    return bytesToBits(barr.slice(0,4));
};


class InputArray{
    constructor(n){
        this.arr = [];
        for(let i = 0; i < n; i++){
            this.arr.push(new Input);
        }
    }
    setBits(bits){
        console.log(bits);
        let max = bits.length > this.arr.length ? this.arr.length : bits.length;
        for(let i = 0; i < max; i++){
            this.arr[i].value = bits[i];
        }
    }
    static fromInt(n,r=32){
        let res = new InputArray(r);
        res.setInt(n);
        return res;
    }
    setInt(n){
        this.setBits(intToBits(n));
    }
    static fromFloat(n){
        let res = new InputArray(32);
        res.setFloat(n);
        return res;
    }
    setFloat(n){
        this.setBits(floatToBits(n));
    }
    static fromDouble(n){
        let res = new InputArray(64);
        res.setDouble(n);
        return res;
    }
    setDouble(n){
        this.setBits(doubleToBits(n));
    }
}

let n1 = 114514;
let n2 = 1919;

let input1 = InputArray.fromInt(n1);
let input2 = InputArray.fromInt(n2);
let res = mul(input1.arr,input2.arr);


console.log(/*parseInt(*/res.map(v=>v.value).reverse().join("")/*,2)*/);
console.log(parseInt(res.map(v=>v.value).reverse().join(""),2),n1*n2);







