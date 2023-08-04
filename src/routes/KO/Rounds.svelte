<script>
	//@ts-nocheck
	import { writable } from 'svelte/store';
	import Game from './Game.svelte';

	const resStore = writable('');
	const pairStore = writable('');
	const mapStore = writable('');
    const playerStore = writable('');
    const numtostore = writable('');
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



	let gamesarr;
		$:{ 
			gamesarr = new Array(gamesperround);
		}

	let revmap = new Map();

	$:{
		revmap = reverser(players); 
	}

    
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
        rundigStore.set(Einzelrundig);
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
					break;
					case "BlackWon":
						resmap.set(curPairs[2][curPairs[2].length-i-1].name,resmap.get(curPairs[2][curPairs[2].length-i-1].name)+1);
					break;

					case "Draw":
						resmap.set(curPairs[0][i].name,resmap.get(curPairs[0][i].name)+0.5);
						resmap.set(curPairs[2][curPairs[2].length-i-1].name,resmap.get(curPairs[2][curPairs[2].length-i-1].name)+0.5);
					break;
				}
			}
		)
		curround++;
        resmap = resmap
    }
</script>

{#if results == undefined}
  <div>Loading...</div>
  {:else}
  <main>
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