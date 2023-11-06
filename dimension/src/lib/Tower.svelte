<script lang="ts">
  let sphereCount = 11;
</script>

<section class="tower">
  <label class="field">
    Spheres
    <input type="range" name="sphere-count" min="0" max="11" bind:value={sphereCount} />
    <output>{sphereCount}</output>
  </label>

  <label class="field">
    All colors?
    <input type="checkbox" name="all-colors" checked={false} />
  </label>
</section>

<style>
  .tower {
    max-inline-size: 600px;
    margin-inline: auto;
  }

  .field {
    display: flex;
    flex-direction: column;
    margin-block-end: 32px;
  }
</style>
