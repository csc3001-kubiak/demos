<script lang="ts">
  import { type Philosopher, type ChopStick } from "./philosophers.svelte.ts";

  interface Props {
    diner: Philosopher;
  }

  let { diner }: Props = $props();

  let className = $derived(
    diner.left && diner.right ? "eating" :
      diner.left || diner.right ? "blocked" : "waiting"
  );

  let leftId = $derived(
    diner.left ? diner.left.index : "-"
  );

  let rightId = $derived(
    diner.right ? diner.right.index : "-"
  );

  let buttonLabel = $derived(
    !diner.isActive ? "Start" :
      diner.left && diner.right ? "Eating" :
        diner.left || diner.right ? "Blocked" :
          "Waiting"
  );
</script>

<tr class={className}>
  <th>{diner.index}</th>
  <td>{leftId}</td>
  <td>{rightId}</td>
  <td><button disabled={ diner.isActive }
    onclick={() => diner.eat()}
    >
     { buttonLabel }
    </button>
  </td>
</tr>

<style>
 .eating {
     background-color: darkgreen;
     color: white;
 }
 .blocked {
     background-color: firebrick;
     color: white;
 }
 button {
     color: inherit;
 }
</style>
