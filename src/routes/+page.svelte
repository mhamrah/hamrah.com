<script>
	import { resolve } from '$app/paths';
</script>

<main>
	<div class="text-primary-50 grid h-screen place-items-center content-center">
		<h1 class="text-xl md:text-4xl lg:text-6xl xl:text-8xl">
			Welcome to <span
				class="background-animate bg-gradient-to-r from-cyan-500 to-pink-500 bg-clip-text font-extrabold text-transparent"
				>Hamrah.com</span
			>
		</h1>
		<p class="text-xl md:text-2xl lg:text-3xl xl:text-4xl">
			<a href="https://www.michaelhamrah.com" class="underline" title="Michael Hamrah"
				>Michael Hamrah</a
			>
		</p>
		<p>
			<a href={resolve('/flow')}>Flow</a>
		</p>
	</div>
</main>

<style>
	.background-animate {
		background-size: 200%;

		animation: gradient 15s ease infinite;
	}
</style>
