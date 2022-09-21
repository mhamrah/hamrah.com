<script lang="ts">
  import createAuth0Client, { Auth0Client, User } from "@auth0/auth0-spa-js";
  import App from "./App.svelte";

  export let prod: Boolean;
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
      window.history.replaceState({}, document.title, "/");
    }
    user = await client.getUser();
    console.log("u", user);
  };

  let login = async () => {
    await client.loginWithRedirect({
      redirect_uri: prod ? "https://hamrah.com" : "http://localhost:3000/",
    });
    user = await client.getUser();
    console.log("login finished", user);
  };
</script>

{#await check()}
  <p>...waiting</p>
{:then u}
  {#if user}
    <App {client} {user} />
  {:else}
    <button on:click={login}>Login</button>
  {/if}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
