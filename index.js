export class PrimitiveGate{
    constructor(...inputs){
        if(inputs[0] instanceof Array) inputs = inputs[0];
        this.inputs = inputs;
        for(let input of inputs){
            input.connect(this);
        }
        this.update();
    }
    value = 2;
    connections = [];
    connect(gate){
        this.connections.push(gate);
    }
}

export class And extends PrimitiveGate{
    update(){
        let val = 1;
        for(let input of this.inputs){
            let v1 = input.value;
            if(v1 === 0){
                val = 0;
                break;
            }else if(v1 === 2){
                val = 2;
            }
        }
        if(this.value === val)return;
        this.value = val;
        for(let gate of this.connections){
            gate.update();
        }
    }
}
export const and = function(...vals){
    return new And(...vals);
};

export class Or extends PrimitiveGate{
    update(){
        let val = 0;
        for(let input of this.inputs){
            let v1 = input.value;
            if(v1 === 1){
                val = 1;
                break;
            }else if(v1 === 2){
                val = 2;
            }
        }
        if(this.value === val)return;
        this.value = val;
        for(let gate of this.connections){
            gate.update();
        }
    }
}
export const or = function(...vals){
    return new Or(...vals);
};

export class Not extends PrimitiveGate{
    update(){
        let v0 = this.inputs[0].value;
        let val = 2;
        if(v0 === 0)val = 1;
        if(v0 === 1)val = 0;
        if(this.value === val)return;
        this.value = val;
        for(let gate of this.connections){
            gate.update();
        }
    }
}
export const not = function(val){
    return new Not(val);
};

export const High = {
    value: 1,
    connect: ()=>{}
};

export const Low = {
    value: 0,
    connect: ()=>{}
}

export class Input{
    connections = [];
    connect(gate){
        this.connections.push(gate);
    }
    _value = 2;
    set value(val){
        this._value = val;
        for(let gate of this.connections){
            gate.update();
        }
    }
    get value(){
        return this._value;
    }
}


