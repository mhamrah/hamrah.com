<script lang="ts">
  import type { Auth0Client, User } from "@auth0/auth0-spa-js";

  export let client: Auth0Client;
  export let user: User | undefined;

  const logout = () => {
    client.logout({
      returnTo: "http://localhost:3000/",
    });
  };
</script>

{#if user}
  {user.family_name} {user.email} <button on:click={logout}>logout</button>
{:else}
  No user
{/if}
