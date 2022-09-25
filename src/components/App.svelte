<script lang="ts">
  import type { User } from "@auth0/auth0-spa-js";

  export let user: User | undefined;
  export let getToken: () => Promise<string>;

  let todos = [];

  const callApi = async () => {
    const token = await getToken();
    const result = await fetch("https://api.hamrah.com/todos", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    todos = await result.json();
    console.log(todos);
  };
</script>

{#if user}
  {user.family_name}
  {user.email} <button on:click={callApi}>get todos</button>

  {#each todos as todo (todo.id)}
    {todo.id} - {todo.name} - {todo.created_at}
  {/each}
{:else}
  No user
{/if}
