<script lang="ts">
	// get canvas from dom and set width and height to innerWidth and innerHeight
	let canvas: HTMLCanvasElement;
	let h = 0;
	let w = 0;

	import './flow.pcss';
	import { onMount } from 'svelte';

	onMount(() => {
		function onResize() {
			w = window.innerWidth;

			console.log(h, w);
		}
		window.addEventListener('resize', onResize);
		const ctx = canvas.getContext('2d');

		return () => window.removeEventListener('resize', onResize);
	});
</script>

<svelte:window bind:innerHeight={h} bind:innerWidth={w} />
<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
