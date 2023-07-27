<script>
	import KO from '$lib/Ko.svg';
	import Swiss from '$lib/Swiss.svg';
	import RoundRobin from '$lib/RoundRobin.svg';
</script>

<h1>Turnierrechner</h1>
<div class="center-imp">
	<div class="item-imp">
		<img src={RoundRobin} alt="Player with Plus" width="40%" height="40%" />
		<a href="/JgJ"> Jeder gegen Jeden</a>
	</div>
	<div class="item-imp">
		<img src={KO} alt="Player with Minus" width="40%" height="40%" />
		<a href="/KO">K.o.</a>
	</div>
	<div class="item-imp">
		<img src={Swiss} alt="Player with arrows" width="40%" height="40%" />
		<a href="SchweizerSystem">Schweizer System</a>
	</div>
</div>

<style>
	h1 {
		text-align: center;
		font-size: 3rem;
		width: 100%;
	}

	.center-imp {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 10px;
		width: 50%;
		height: 50%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.item-imp:hover {
		transition: 1s;
		transform: scale(110%);
	}
	.item-imp {
		border-radius: 50px;
		background-color: rgba(155, 151, 151, 0.733);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 30%;
		height: 30%;
		transition: 1s;
		font-size: large;
		text-align: center;
	}

    a{
        text-decoration: none;
        color: black;
    }
</style>
