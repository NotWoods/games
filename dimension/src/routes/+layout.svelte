<script lang="ts">
  import '../app.css';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  stroke-linejoin="round"
  viewBox="0 0 94 150"
  style="display: none"
>
  <path id="symbol-stack" d="m46.9 0 42.4 150H4.5L46.9 0Z" fill="#fff" fill-opacity=".3" />
  <path
    id="symbol-cross"
    d="M36 52.5c0-.6 5.2-2 6-1.5 2.4 1.7 7.5 13.5 7.5 13.5s10.6-13 14.3-15.8c.4-.3 6.4 1.8 6 3-1.1 2.9-15.8 21-15.8 21s7.4 14 8.1 18c.5 2.6-2.3 7.5-3.6 6.8-4.5-2.5-11.6-15-11.6-15s-16 26.6-19.1 26.3c-3.7-.5-4.5-9.4-3.8-10.5 3.3-5.5 18.8-24.8 18.8-24.8S36.5 60 36 52.5Z"
    fill="red"
    filter="url(#symbol-cross-shadow)"
  />
  <path
    id="symbol-above"
    d="M39.8 66h14.8V76h8.3l-15.7 8.5-15.8-8.5h8.4V66Z"
    fill="#fff"
    filter="url(#symbol-shadow)"
  />
  <path
    id="symbol-more-than"
    d="M56 77.6 35.3 90.8v-9L48 74.5l-12.8-7.1v-9l21 13.2c1 .8 1.5 1.8 1.5 3 0 1.1-.6 2.2-1.7 3Z"
    fill="#fff"
    filter="url(#symbol-shadow)"
  />
</svg>

<slot />

<svg
  xmlns="http://www.w3.org/2000/svg"
  stroke-linejoin="round"
  viewBox="0 0 94 150"
  width="0"
  height="0"
  aria-hidden="true"
>
  <defs>
    <filter id="symbol-shadow">
      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#000" flood-opacity="0.75" />
    </filter>
    <filter id="symbol-cross-shadow">
      <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.75" />
    </filter>
    <linearGradient id="rainbow-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e4dbd1" />
      <stop offset="25%" stop-color="#193e72" />
      <stop offset="50%" stop-color="#c44529" />
      <stop offset="75%" stop-color="#256d30" />
      <stop offset="100%" stop-color="#040200" />
    </linearGradient>
  </defs>
</svg>
