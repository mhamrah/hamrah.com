<script lang="ts">
	import { onMount } from 'svelte';

	// Reference to the canvas element
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationFrameId: number;
	const particles = [];
	const particleCount = 100;
	const velocityScale = 2;

	// Function to set the canvas size
	function setCanvasSize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx.fillStyle = 'white'; // Set the fill color to white
		ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with white
	}

	// Initialize particles with random positions and colors
	function initParticles() {
		for (let i = 0; i < particleCount; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Hue varies, full saturation, 50% lightness
				angle: Math.random() * Math.PI * 2
			});
		}
	}

	// Update particle positions and draw them
	function updateParticles() {
		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for the next frame
		ctx.fillStyle = 'white'; // Set the fill color to white
		ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with white
		particles.forEach((particle) => {
			// Calculate velocity based on the angle
			const vx = Math.cos(particle.angle) * velocityScale;
			const vy = Math.sin(particle.angle) * velocityScale;

			// Update particle position
			particle.x += vx;
			particle.y += vy;

			// Wrap particles around the edges of the canvas
			if (particle.x < 0) particle.x = canvas.width;
			if (particle.x > canvas.width) particle.x = 0;
			if (particle.y < 0) particle.y = canvas.height;
			if (particle.y > canvas.height) particle.y = 0;

			// Draw particle
			ctx.fillStyle = particle.color;
			ctx.beginPath();
			ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
			ctx.fill();

			// Randomly change the particle's angle to simulate a flow field effect
			particle.angle += (Math.random() - 0.5) * 0.2;
		});
	}
	// Animation loop
	function animate() {
		updateParticles();
		animationFrameId = requestAnimationFrame(animate);
	}

	// Set the canvas size on mount and add a resize event listener
	onMount(() => {
		ctx = canvas.getContext('2d');
		setCanvasSize();
		initParticles();
		animate();

		window.addEventListener('resize', setCanvasSize);

		// Cleanup the event listener on component destruction
		return () => {
			window.removeEventListener('resize', setCanvasSize);
			cancelAnimationFrame(animationFrameId);
		};
	});
</script>

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
