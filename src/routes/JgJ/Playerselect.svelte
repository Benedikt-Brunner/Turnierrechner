<script>
        //@ts-nocheck
    import { writable } from 'svelte/store';

	

const dataStore = writable('');
    

    /**
	 * @type {Array<String>}
   */
    export let players;

   /**
	 * @type {any}
	 */
   export let selectedplayer;

$: {
  dataStore.set(selectedplayer);
}
    

</script>

{#if players == undefined}
  <div>Loading...</div>
{/if}
{#if players }
<select bind:value={selectedplayer}>
  {#each players as player, i}
    <option value={player}>{player.name}</option>
  {/each}
</select>
{/if}





<style>
select {
  width: 20vw;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
