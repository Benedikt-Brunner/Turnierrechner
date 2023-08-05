<script>
	//@ts-nocheck
	import { writable } from 'svelte/store';
	import Game from './Game.svelte';

	const resStore = writable('');
	const pairStore = writable('');
	const mapStore = writable('');
	const sitoutStore = writable('');
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
	export let sitoutmap = new Map();

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

	/**
	 * @type {Map<String, Array>}
	 */
	let matchmap = new Map();

	players.forEach((player) =>{
		matchmap.set(player.name, [])
	})



	function reverser(arr){
		let res = new Map();
		arr.forEach(obj => {
			res.set(obj.name,obj);
		});
		return res;
	}


	let curPairs = new Array(3);
		curPairs.fill().map(() => new Array());

	$: {
		pairStore.set(pairings);
		resStore.set(results);
		mapStore.set(resmap);
		sitoutStore.set(sitoutmap);
		curroundStore.set(curround);
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
		update();
	}


	function update(e){
		if(curround == 0){
			if(players.length % 2 == 0){
				curPairs[0] = players.slice(0,Math.floor(players.length/2));
				curPairs[1] = [];
				curPairs[2] = players.slice(Math.floor(players.length/2),players.length);
			}else{
				curPairs[0] = players.slice(0,Math.floor(players.length/2));
				curPairs[1] = players.slice(Math.floor(players.length/2),Math.floor(players.length/2)+1);
				curPairs[2] = players.slice(Math.floor(players.length/2)+1,players.length);
				sitoutmap.set(curPairs[1][0].name, sitoutmap.get(curPairs[1][0].name)+1);
			}
		}else{
			players = players.sort((a,b) => {
				return resmap.get(a.name) - resmap.get(b.name);
			});
			if(players.length % 2 == 0){
				assign(players, new Array(players.length/2), new Array(players.length/2), [], 0);
			}else{
			const init = 10000;
			let min = players.reduce((min, p) => sitoutmap.get(p.name) < min ? sitoutmap.get(p.name) : min, init);
			let tempPlayers = players.reverse();
			let sitout = tempPlayers.find(p => sitoutmap.get(p.name) == min);
			tempPlayers = players.filter(p => p.name != sitout.name);
			assign(tempPlayers,new Array(tempPlayers.length/2),new Array(tempPlayers.length/2), sitout, 0);
			sitoutmap.set(sitout.name, sitoutmap.get(sitout.name)+1);
			}
		}
		setPairings();
	}

	function setPairings(){
		const updatedPairs = pairings.map((round) => [...round]); 
		for(let i = 0; i < curPairs[0].length; i++){
			updatedPairs[curround][i] = [curPairs[0][i].name, curPairs[2][curPairs[2].length-i-1].name];
			matchmap.set(curPairs[0][i].name, matchmap.get(curPairs[0][i].name).concat([curPairs[2][curPairs[2].length-i-1].name]))
			matchmap.set(curPairs[2][curPairs[2].length-i-1].name, matchmap.get(curPairs[2][curPairs[2].length-i-1].name).concat([curPairs[0][i].name]))
		}
		pairings = updatedPairs;
	}

	/**
	 * @param {Array} arr
	 * @param {Array} res1  
	 * @param {Array} res2 
	 * @param {String} sitout 
	 * @param {Number} i
	 */
	function assign(arr,res1,res2,sitout, i){
		if(arr.length == 0){
			curPairs[0] = res1;
			curPairs[1] = Array.isArray(sitout) ? sitout : [sitout];
			curPairs[2] = res2;
			return;
		}
		let coin = Math.round(Math.random());
		
		if(coin == 0){
			res1[i] = arr[0];
			res2[res2.length-1-i] = find(res1[i], arr.filter((p) => p.name != res1[i].name));
		}else{
			res2[res2.length-1-i] = arr[0]
			res1[i] = find(res2[res2.length-1-i], arr.filter((p) => p.name != res2[res2.length-1-i].name));
		}

		assign(
			arr.filter((p) => p.name != res1[i].name && p.name != res2[res2.length-1-i].name),
			res1,
			res2,
			sitout,
			i+1
			)
	}

	function find(player, matchArr){
		let match;
		let matchingscoremap = new Map();
		matchArr.forEach((matchee) =>{
			matchingscoremap.set(matchee.name, Math.abs(resmap.get(player.name) - resmap.get(matchee.name)) + (matchmap.get(player.name).includes(matchee.name) ? 2 : 0))
		})
		match = matchArr.reduce((min, p) => matchingscoremap.get(p.name) < matchingscoremap.get(min.name) ? p : min);
		return match
	}
	update();
</script>

{#if results == undefined}
  <div>Loading...</div>
  {:else}
  {#each results as round, i}
  {#if i == curround}
  <div class = "Round">
	<h1>Runde {i+1}</h1>
	{#each round as game, j}
	<Game player1 = {curPairs[0][j]} player2 = {curPairs[2][curPairs[2].length-j-1]} bind:res = {results} i = {i} j = {j}/>
	{/each}
	{#if curPairs[1].length == 0}
	<p id = "sitout">Setzt aus: Niemand</p>
	{:else if curPairs[1][0] != undefined}
	<p id = "sitout">Setzt aus: {curPairs[1][0].name}</p>
	{/if}
  </div>
  {/if}
  {/each}
  <button on:click={nextRound}>Weiter</button>
{/if} 



<style>
h1{
	text-align: center;
}

.Round{
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 60%;
}
</style>