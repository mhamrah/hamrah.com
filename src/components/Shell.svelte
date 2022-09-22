<script lang="ts">
  import createAuth0Client, { Auth0Client, User } from "@auth0/auth0-spa-js";
  import App from "./App.svelte";

  let client: Auth0Client;

  let auth0 = createAuth0Client({
    domain: "hamrah.auth0.com",
    client_id: "5Hj47gq7sXbtb9xYUtBOwHZ7n4t2Pf3S",
    cacheLocation: "localstorage",
  });

  let user: User | undefined;

  let check = async () => {
    client = await auth0;
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      await client.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/app");
    }
    if (await client.isAuthenticated()) {
      user = await client.getUser();
    } else {
      let redirect_uri = `${window.location.protocol}//${window.location.host}/app`;
      await client.loginWithRedirect({
        redirect_uri,
      });
    }
  };

  const logout = () => {
    let returnTo = `${window.location.protocol}//${window.location.host}`;
    client.logout({
      returnTo,
    });
  };
</script>

{#await check()}
  <p>...waiting</p>
{:then u}
  {#if user}
    <App {user} /> <button on:click={logout}>logout</button>
  {/if}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
