<script lang="ts">
  interface Props {
    value: string;
    children: import('svelte').Snippet;
  }

  let { value, children }: Props = $props();
</script>

<label class="check">
  <input type="checkbox" name="task" {value} checked={false} />
  <div class="task-container">
    {@render children()}
  </div>
</label>

<style>
  label {
    display: block;
    position: relative;
  }

  input {
    position: absolute;
    z-index: 1;
    accent-color: #fee457;
  }

  .task-container {
    transition:
      transform 0.2s ease-in-out,
      opacity 0.2s ease-in-out;
  }
  input:checked + .task-container {
    opacity: 0.5;
    transform: scale(0.9);
  }
</style>
