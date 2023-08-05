function makearr(len){
    var arr = [];
    for(var i = 0; i < len; i++){
        if(
            len % 2 == 0
        ){
            arr.push(i+1);
        }else{
            arr.push(i);
        }
    }
    return arr;
}

function movearr(arr, rounds){
    let r = rounds-1 % arr.length;
    let newarr = new Array(arr.length);
    newarr[0] = arr[0];
    for(var i = 1; i < arr.length; i++){
        if(i + r < arr.length){
            newarr[i + r] = arr[i];
        }else{
            if(i + r - arr.length == 0){
                newarr[1] = arr[i];
            }else{
            newarr[i + r - arr.length +1] = arr[i];
            }
        }
    }
    return newarr;
}

class Match{
    constructor(white, black){
        this.white = white;
        this.black = black;
    }

    invert() {
        let temp = this.white;
        this.white = this.black;
        this.black = temp;
    }
}

function makeMatches(arr, r){
     let matches = [];
        for(var i = 0; i < arr.length / 2; i++){
            if(i % 2 == 0){
                matches.push(new Match(arr[i], arr[arr.length - i - 1]));
            }else{
                matches.push(new Match(arr[arr.length - i - 1], arr[i]));
            }
        }
        if(r % 2 == 0){
            matches[0].invert();
        }
return matches;
}

console.log(movearr(makearr(8), 1))
console.log(makeMatches(movearr(makearr(8), 1), 1))
console.log(makeMatches(movearr(makearr(8), 2), 2))
console.log(makeMatches(movearr(makearr(8), 3), 3))
console.log(makeMatches(movearr(makearr(8), 4), 4))
console.log(makeMatches(movearr(makearr(8), 5), 5))
console.log(makeMatches(movearr(makearr(8), 6), 6))
console.log(makeMatches(movearr(makearr(8), 7), 7))
console.log(makeMatches(movearr(makearr(8), 8), 8))