<script lang="ts">
  import {setTable, startAllEating} from "./philosophers.svelte.ts";
  import Diner from "./Diner.svelte";

  const table = $state(setTable());
  const diners = $derived(table.diners);

</script>

<main>
  <table>
    <thead>
      <tr>
        <th>Philosopher#</th>
        <th>Left<br>Chopstick#</th>
        <th>Right<br>Chopstick#</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each diners as ph}
        <Diner diner={ph}/>
      {/each}
    </tbody>
  </table>

  <p>
      <button onclick={() => startAllEating(diners)}>
          Start all Philosophers at once
      </button>
  </p>
</main>
