<script>
    	//@ts-nocheck

        let resmap = new Map();
        resmap.set("WhiteWon","1-0")
        resmap.set("Draw","½-½")
        resmap.set("BlackWon","0-1")

    export let player1;

    export let player2;

    export let res;

    export let i;

    export let j;

    function setwhite(){
        const updatedResults = res.map((round) => [...round]); 
        updatedResults[i][j] = "WhiteWon"; 
         res = updatedResults; 
    }

    function setdraw (){
        const updatedResults = res.map((round) => [...round]); 
        updatedResults[i][j] = "Draw"; 
         res = updatedResults; 
    }

    function setblack (){
        const updatedResults = res.map((round) => [...round]); 
        updatedResults[i][j] = "BlackWon"; 
         res = updatedResults; 
    }

    function reset(){
        const updatedResults = res.map((round) => [...round]); 
        updatedResults[i][j] = "None"; 
         res = updatedResults;
    }

</script>
<div class="wrap">
    <span>
        {player1.name}
    </span>
    {#if res[i][j] == "None"}
    <div class="res">
        <button class="white" on:click={setwhite}>1-0</button>
        <button class="draw" on:click={setdraw}>½-½</button>
        <button class="black" on:click={setblack}>0-1</button>
    </div>
    {:else}
    <div class="res">
        <div></div>
        <p>{resmap.get(res[i][j])}</p>
        <button on:click={reset} id = "Reset">❌</button>
    </div>
    {/if}
    <span>
        {player2.name}
    </span>
</div>

<style>
    #Reset{
        width: 2vw;
        height: 2vw;
        border-radius: 50px;
        font-size: 90%;
        background-color: black;
    }
    p{
        font-size: 130%;
    }
    .wrap{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 5%;
    }
    .res{
        width: 20%;
        height: 3vw;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 2%;
    }

     button{
        width: 25%;
        height: 65%;
        border-radius: 50px;
        cursor: pointer;
    }

    button:active {
  box-shadow: 0 1px #666;
  transform: translateY(2px);
}

    .white{
        background-color: white;
    }

    .black{
        background-color: black;
        color: white;
    }

    .draw{
        background-color: grey;
        }
</style>