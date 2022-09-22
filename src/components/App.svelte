<script lang="ts">
  import type { Auth0Client, User } from "@auth0/auth0-spa-js";

  export let user: User | undefined;
</script>

{#if user}
  {user.family_name} {user.email}
{:else}
  No user
{/if}
