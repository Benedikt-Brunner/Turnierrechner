<script>
    //@ts-nocheck
    import Playerselect from './Playerselect.svelte';
    import Rounds from './Rounds.svelte';
    import Table from './table.svelte';
    export let data;
    let { rows } = data;

    /**
     * @type {Map<String, number>}
    */
   let statemap = new Map();
    statemap.set("Setup",0)
    statemap.set("Turnierauswertung",1)
    statemap.set("Ausgabe",2)

    /**
     * @type {Map<Number, string>}
    */
    let mapstate = new Map();
    mapstate.set(0,"Setup")
    mapstate.set(1,"Turnierauswertung")
    mapstate.set(2,"Ausgabe")



    /**
     * @type {Map<String, number>}
     */
    let resmap = new Map();

        /**
     * @type {Map<String, number>}
     */
     let playermap = new Map();

             /**
     * @type {Map<String, number>}
     */
     let numtoplayermap = new Map();


    let tablearray;
    let finalplayers;
   let state = 0;
   let playercount = 2;
   let rounds = 1;
   let date = new Date();
   let playersSet = false;
   let players = [];
   let name = "";
   let types = {
         Classical: "Classical",
         Blitz: "Blitz",
         Rapid : "Rapid",
         C960 : "Chess960"  
   }
    let type = types.Classical.toString();
   let meta;
   let results;
   let pairings;
   let gamesperround = 0;
   let curround = 0;

   function changeState(newstate){
       state = statemap.get(newstate);
   }

   function makejson(){
    changeState("Ausgabe") 
   }

   function enterPlayers(){
    if(playercount < 2){
        alert("Es müssen mindestens 2 Spieler teilnehmen!")
        return;
    }
        playersSet = true;
        players = new Array(playercount);
   }

   function enterMeta(){
       if(name == ""){
           alert("Bitte einen Namen eingeben!")
           return;
       }
       if(date == ""){
           alert("Bitte ein Datum eingeben!")
           return;
         }
         if(rounds < 1){
              alert("Es muss mindestens eine Runde gespielt werden!")
              return;
         }

         let set = new Set(players);
            if(set.size != players.length){
                alert("Jeder Spieler darf nur einmal ausgewählt werden!")
                return;
            }

            players.forEach(player => {
                resmap.set(player.name,0);
            });




            rounds = rounds * (players.length % 2 == 0 ? players.length-1 : players.length)
            results = new Array(rounds );
            pairings = new Array(rounds);
            gamesperround = Math.floor(players.length/2);
            results.fill(new Array(gamesperround).fill("None"));
            pairings.fill(new Array(gamesperround).fill(["None","None"]));
            players.sort((a,b) => {
                switch (type) {
                    case types.Classical:
                        return a.classical_elorating - b.classical_elorating;
                    case types.Blitz:
                        return a.blitz_elorating - b.blitz_elorating;
                    case types.Rapid:
                        return a.rapid_elorating - b.rapid_elorating;
                    case types.C960:
                        return a.c960_elorating - b.c960_elorating;

                }
            });
            players = players.reverse();
            players.forEach((p, i) => {
                playermap.set(p.name,i);
            });
            players.forEach((p, i) => {
                numtoplayermap.set(i, p);
            });
            
       changeState("Turnierauswertung")
   }

   function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  $:{
    if(curround == rounds){
        state = 2;
        meta = {
            Games: []
        }
        for(let i = 0; i < rounds; i++){
            for(let j = 0; j < gamesperround; j++){
                meta.Games.push(new Game(pairings[i][j][0],pairings[i][j][1],results[i][j],type, date, name));
            }
        }
        finalplayers = JSON.parse(JSON.stringify(players));
        finalplayers = finalplayers.sort((a,b) => {
				return resmap.get(a.name) - resmap.get(b.name);
			});
            finalplayers = finalplayers.reverse();
    }
  }

  class Game{
      constructor(player1,player2,result, gametype, date, event){
          this.player1 = player1;
          this.player2 = player2;
          this.result = result;
        this.gametype = gametype;
        this.date = date;
        this.event = event;
      }
  }
</script>


<h1>{mapstate.get(state)}</h1>


<main>
    {#if state == 0}
    <div>
        <label for="name">Turniername:</label>
        <input type="text" id="name" name="name" placeholder="Bitte ausfüllen" bind:value={name}>
    </div>
    <div>
        <label for="date">Datum:</label>
        <input type="date" id="date" name="date" bind:value={date} default = {date}>
    </div>
    <div>
        <label for="type">Spielmodus:</label>
        <select id="type" name="type" bind:value={type} default = "Klassisch">
            <option value={types.Classical.toString()}>Klassisch</option>
            <option value={types.Blitz.toString()}>Blitz</option>
            <option value={types.Rapid.toString()}>Schnellschach</option>
            <option value={types.C960.toString()}>Schach960</option>
        </select>
    </div>
    <div>
        <label for="rounds">Einzelrundig:</label>
        <input type="radio" name = "roundtype" value = {1} bind:group={rounds} id = "r-pad" >
        <label for="rounds">Doppelrundig:</label>
        <input type="radio" name = "roundtype" value = {2} bind:group={rounds}>
    </div>
    {#if !playersSet}
<div>
    <label for="players">Spieler:</label>
    <input type="number" id="players" name="players" min="2" placeholder="Bitte ausfüllen" bind:value={playercount}>
</div>
<button on:click={enterPlayers}>Weiter</button>
{:else}
{#each players as player, i}
    <div>
    <label for="player${i+1}">Spieler{i+1}:</label>
    <Playerselect players={rows} bind:selectedplayer = {players[i]} />
    </div>
{/each}
<button on:click={enterMeta}>Eingabe</button>
{/if}
{:else if state == 1}
{#if curround < rounds}
<Rounds players={players} bind:results={results} bind:resmap={resmap}  gamesperround={gamesperround}  bind:numtoplayermap = {numtoplayermap} bind:tablearray = {tablearray}
bind:curround = {curround} bind:pairings = {pairings} bind:playermap = {playermap} bind:rounds = {rounds}/>
{:else if curround == rounds}
<button on:click={makejson}>Eingabe</button>
{/if}
{:else if state == 2}

<Table bind:players = {players} bind:resmap = {resmap} bind:tablearray = {tablearray} />
<table>
    <tr>
        <th>Name</th>
        <th>Ergebnis</th>
    </tr>
    {#each finalplayers as player, i}
    <tr>
        <td>{player.name}</td>
        <td>{resmap.get(player.name)}</td>
    </tr>
    {/each}
</table>
<button on:click={() => {downloadObjectAsJson(meta, name)}}>JSON-Datei runterladen</button>
{/if}
</main>
    

<style>

    #r-pad{
        margin-right: 10%;
    }
    h1{
        text-align: center;
        font-size: 3rem;
        width: 100%;
    }

    main{
        width: 80vw;
        margin-left: 10vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    main > div{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;
        margin: 2%;
        width: 20%;
    }

    main > div > label{
        margin-right: 1%;
        white-space: nowrap;
    }

    .Logo-L{
        width: 5%;
        aspect-ratio: 1/1;
        position: absolute;
    }
    .Logo-L > img{
        width: 100%;
        height: 100%;
    }

    .Logo-R{
        margin-left: 94%;
        width: 5%;
        aspect-ratio: 1/1;
        position: absolute;
    }
    .Logo-R > img{
        width: 100%;
        height: 100%;
    }

    table{
        border-collapse: collapse;
        width: 20%;
        text-align: center;
        margin: 5%;
    }

    table, th, td {
  border: 1px solid;
}

</style>