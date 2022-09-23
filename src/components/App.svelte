<script lang="ts">
  import type { User } from "@auth0/auth0-spa-js";

  export let user: User | undefined;
  export let getToken: () => Promise<string>;

  const callApi = async () => {
    const token = await getToken();
    const result = await fetch("/api", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await result.json();
    console.log(data);
  };
</script>

{#if user}
  {user.family_name}
  {user.email} <button on:click={callApi}>token</button>
{:else}
  No user
{/if}
