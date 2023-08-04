 <script>
    //@ts-nocheck
    import { writable } from "svelte/store";
    
    let playerstore = writable([]);
    let curRstore = writable(0);
    export let players;
    export let curround;
    $:{
        playerstore.set(players);
        curRstore.set(curround);
    }





    let rounds = new Array(Math.ceil(Math.log2(players.length))) 
    rounds = rounds.fill().map((_, i) => new Array(2 ** (rounds.length - (i+1))).fill(0))
    console.log(rounds)
</script>
<div class="wrap">
{#each rounds as round, i}
    {#if i <= curround}
    <div class="round">
        {#each round as matches, i}
            <div class="match">
                <div class="player"><span>{players[2*i] ? players[2*i].name : "Frei"}</span></div>
                <div class="player"><span>{players[2*i + 1] ? players[2*i + 1].name : "Frei"}</span></div>
            </div>
        {/each}
    </div>
    {/if}
{/each}
</div>

<style>
.wrap{
    border: solid 1px black;
    width: 60%;
    aspect-ratio: 3/1;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 5%;
}

.round{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 80%;
    height: 80%;
}

.match{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 80%;
    margin: 5%;
}


.player{
    border: solid 1px black;
    width: 60%;
    aspect-ratio: 3/1;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>