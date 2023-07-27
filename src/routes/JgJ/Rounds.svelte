<script>
	//@ts-nocheck
	import { writable } from 'svelte/store';
	import Game from './Game.svelte';
    import Table from './table.svelte';

	const resStore = writable('');
	const pairStore = writable('');
	const mapStore = writable('');
    const playerStore = writable('');
    const numtostore = writable('');
    const tableStore = writable('');
    const rundigStore = writable('');
	const curroundStore = writable(0);


	/**
	 * @type {Array<Array>}
	 */
	export let results;

			/**
	 * @type {Array<Array>}
	 */
	export let pairings;

		/**
	 * @type {Array}
	 */
	 export let players;

	/**
	 * @type {Number}
	 */
	export let curround;

	/**
	 * @type {Map<String, number>}
	 */
	export let resmap = new Map();


	/**
	 * @type {Map<String, number>}
	 */
	export let playermap = new Map();

    	/**
	 * @type {Map<String, number>}
	 */
	export let numtoplayermap = new Map();

    
	/**
	 * @type {Number}
	 */
	export let  rounds;

	/**
	 * @type {Number}
	 */
	export let  gamesperround;

    /**
	 * @type {Boolean}
	 */
	export let  Einzelrundig;



	let gamesarr;
		$:{ 
			gamesarr = new Array(gamesperround);
		}

	let revmap = new Map();

	$:{
		revmap = reverser(players); 
	}

    export let tablearray = new Array(players.length);
    tablearray  = Einzelrundig ? tablearray.fill().map(() => new Array(players.length).fill('-')) : tablearray.fill().map(() => new Array(players.length).fill().map(() => new Array()));


	function reverser(arr){
		let res = new Map();
		arr.forEach(obj => {
			res.set(obj.name,obj);
		});
		return res;
	}


	let curPairs = new Array(3);
		curPairs.fill([]);

	$: {
		pairStore.set(pairings);
		resStore.set(results);
		mapStore.set(resmap);
		curroundStore.set(curround);
        playerStore.set(playermap);
        numtostore.set(numtoplayermap);
        tableStore.set(tablearray);
        rundigStore.set(Einzelrundig);
	}

 


        function init(){
            if(players.length % 2 == 1){
                curPairs[1] = [players[players.length-1]];
                let temparr = players.slice(0,players.length-1);
                genAssign(temparr);
            }else{
                genAssign(players);
            }
        }

        function genAssign(arr){
            curPairs[0] = arr.slice(0,arr.length/2);
            curPairs[2] = arr.slice(arr.length/2,arr.length);
        }

// helper stuff
            function makearr(len){
    var arr = [];
    for(var i = 0; i < len; i++){
        if(len % 2 == 1 && i == 0){
            arr.push(-1)
        }
            arr.push(i);
    }
    return arr;
}

function movearr(arr, rounds){
    let r = rounds % arr.length;
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

/**
 * 
 * @param {Array} arr 
 * @param {Number} r 
 * @returns 
 */
function makeMatches(arr, r){
     let matches = [];
     let newarr = arr;
     if(arr[0] == -1){
        matches.push(new Match(arr[0], arr[arr.length - 1]));
        newarr = arr.slice(1,-1);
     }
     
        for(var i = 0; i < newarr.length / 2; i++){
            if(i % 2 == 0){
                matches.push(new Match(newarr[i], newarr[newarr.length - i - 1]));
            }else{
                matches.push(new Match(newarr[newarr.length - i - 1], newarr[i]));
            }
        }
        if(r % 2 == 1 && r != 0){
            matches[0].invert();
        }
return matches;
}
//end helper stuff
        function shuffle(){
            let matches = makeMatches(movearr(makearr(players.length),curround),curround);
            if(matches[0].white == -1){
                curPairs[1] = [numtoplayermap.get(matches[0].black)];
                matches = matches.slice(1);
            }
            if(matches[0].black == -1){
                curPairs[1] = [numtoplayermap.get(matches[0].white)];
                matches = matches.slice(1);
            }
            for(var i = 0; i < matches.length; i++){
                    curPairs[0][i] = numtoplayermap.get(matches[i].white);
                    curPairs[2][curPairs[2].length - (i+1)] = numtoplayermap.get(matches[i].black);
                }
        }

        function setPairings(){
		const updatedPairs = pairings.map((round) => [...round]); 
		for(let i = 0; i < curPairs[0].length; i++){
			updatedPairs[curround][i] = [curPairs[0][i].name, curPairs[2][curPairs[2].length-i-1].name];
		}
		pairings = updatedPairs;
	}

    function nextRound(){
		let res = false;
		results[curround].forEach((value) =>{
			if(value === "None"){
				res = true;
			}
		})
		if(res){
			alert("Bitte alle Ergebnisse eintragen");
			return;
		}
		results[curround].forEach(
			(value, i) => {
				switch (value){
					case "WhiteWon":
						resmap.set(curPairs[0][i].name,resmap.get(curPairs[0][i].name)+1);
                        if(Einzelrundig){
                        tablearray[playermap.get(curPairs[0][i].name)][playermap.get(curPairs[2][curPairs[2].length-i-1].name)] = 1
                        tablearray[playermap.get(curPairs[2][curPairs[2].length-i-1].name)][playermap.get(curPairs[0][i].name)] = 0
                        }else{
                        tablearray[playermap.get(curPairs[0][i].name)][playermap.get(curPairs[2][curPairs[2].length-i-1].name)].push(1) 
                        tablearray[playermap.get(curPairs[2][curPairs[2].length-i-1].name)][playermap.get(curPairs[0][i].name)].push(0)
                        }

					break;
					case "BlackWon":
						resmap.set(curPairs[2][curPairs[2].length-i-1].name,resmap.get(curPairs[2][curPairs[2].length-i-1].name)+1);
                        if(Einzelrundig){
                        tablearray[playermap.get(curPairs[0][i].name)][playermap.get(curPairs[2][curPairs[2].length-i-1].name)] = 0
                        tablearray[playermap.get(curPairs[2][curPairs[2].length-i-1].name)][playermap.get(curPairs[0][i].name)] = 1
                         }else{
                        tablearray[playermap.get(curPairs[0][i].name)][playermap.get(curPairs[2][curPairs[2].length-i-1].name)].push(0)
                        tablearray[playermap.get(curPairs[2][curPairs[2].length-i-1].name)][playermap.get(curPairs[0][i].name)].push(1)
                        }
					break;

					case "Draw":
						resmap.set(curPairs[0][i].name,resmap.get(curPairs[0][i].name)+0.5);
						resmap.set(curPairs[2][curPairs[2].length-i-1].name,resmap.get(curPairs[2][curPairs[2].length-i-1].name)+0.5);
                        if(Einzelrundig){
                        tablearray[playermap.get(curPairs[0][i].name)][playermap.get(curPairs[2][curPairs[2].length-i-1].name)] = 0.5
                        tablearray[playermap.get(curPairs[2][curPairs[2].length-i-1].name)][playermap.get(curPairs[0][i].name)] = 0.5
                        }else{
                        tablearray[playermap.get(curPairs[0][i].name)][playermap.get(curPairs[2][curPairs[2].length-i-1].name)].push(0.5)
                        tablearray[playermap.get(curPairs[2][curPairs[2].length-i-1].name)][playermap.get(curPairs[0][i].name)].push(0.5)
                        }
					break;
				}
			}
		)
        console.log(tablearray)
		curround++;
        resmap = resmap
        tablearray = tablearray
    }

        $: {
            update(curround);
        }

        function update(e) {
            if(e == 0){
                init();
            }else{
                shuffle();
            }
            if(e < rounds)
            setPairings();
        }
</script>

{#if results == undefined}
  <div>Loading...</div>
  {:else}
  <main>
    <Table bind:players = {players} bind:resmap = {resmap} bind:tablearray = {tablearray} />
    {#each results as round, i}
  {#if i == curround}
  <div class = "Round">
	<h2>Runde {i+1}</h2>
          <button on:click={nextRound} >Nächste Runde</button>
	{#each round as game, j}
	<Game player1 = {curPairs[0][j]} player2 = {curPairs[2][curPairs[2].length-j-1]} bind:res = {results} i = {i} j = {j}/>
	{/each}
	{#if curPairs[1].length == 0}
	<p id = "sitout">Setzt aus: Niemand</p>
	{:else if curPairs[1][0] != undefined}
	<p id = "sitout">Setzt aus: {curPairs[1][0].name}</p>
    {:else}
    <p id = "sitout">Setzt aus: {curPairs[1][0]}</p>
	{/if}
  </div>
  {/if}
  {/each}
  </main>
  
{/if} 



<style>


    main{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    h2{
        width: 100%;
        text-align: center;
        margin-bottom: 5%;
    }

    .Round{
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 60%;
}
</style>