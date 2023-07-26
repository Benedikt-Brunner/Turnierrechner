<script>
    //@ts-nocheck
    import { writable } from 'svelte/store';

    const playerStore = writable('');
    const tableStore = writable('');
    const mapStore = writable('');
    export let tablearray;
    export let players;
    export let resmap

    $:{
        tableStore.set(tablearray);
        playerStore.set(players);
        mapStore.set(resmap);
    }
</script>

<table>
    <th>#</th>
    {#each players as p, i}
        <th class="count">{i+1}</th>
    {/each}
    <th>Ergebnis</th>
    {#each players as p, i}
    <tr>
        <td>
            {p.name.split(",")[0]}
        </td>
        {#each players as p2, j}
            {#if i == j}
                <td class="cross"></td>
            {:else}
            {#if tablearray[i]}
            <td>{tablearray[i][j]}</td>
            {:else}
            <td>-</td>
            {/if}
            {/if}
        {/each}
        <td>{resmap.get(p.name)}</td>
    </tr>
    {/each}
    
    </table>


    <style>
            table{
        width: 60%;
        border-collapse: collapse;
        margin-bottom: 5%;
    }

    th,td{
        border: 1px solid black;
        padding: 1%;
    }
    th{
        font-size: 2rem;
        text-align: center;
        width: fit-content;
    }
    td{
        font-size: 1rem;
        text-align: center;
    }

    .count{
        width: 4rem;
    }

    .cross{
        background-image: url($lib/crosshatch.svg);
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    </style>