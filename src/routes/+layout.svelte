<script>
    import LOGO from '$lib/LOGO.png'
</script>


<div class="Logo-L">
    <img src={LOGO} alt="Club-LOGO">
    </div>
    <div class="Logo-R">
        <img src={LOGO} alt="Club-LOGO">
        </div>
<slot />

<style>
    .Logo-L{
        width: 5%;
        aspect-ratio: 1/1;
        position: absolute;
    }
    .Logo-L > img{
        width: 100%;
        height: 100%;
    }

    .Logo-R{
        margin-left: 94%;
        width: 5%;
        aspect-ratio: 1/1;
        position: absolute;
    }
    .Logo-R > img{
        width: 100%;
        height: 100%;
    }
</style>