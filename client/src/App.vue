<script lang="ts">
  import ContactGrid from "./components/Grid.vue";
  
  const API_URL = "http://localhost:8888";

  export default {
    data() {
      return {
        contacts: null,
        columns: ["contact", "organization", "email", "phone1", "city", "statecode", "postcode", "postcode4"],
        searchQuery: ""
      }
    },

    components: {
      ContactGrid
    },
    
    created() {
      this.fetchData();
    },

    methods: {
      async fetchData() {
        const url = `${API_URL}/contacts`;
        this.contacts = await (await fetch(url)).json();
      }
    }
  }
</script>

<template>
  <header>
    <h1><img src="/logo.png" width="25">&nbsp;Autodex</h1>
  </header>
  <main>
    <section class="section">
      <form id="search">
        <div class="field">
          <div class="control">
            <input class="input" type="text" name="query" placeholder="Search..." v-model="searchQuery">
          </div>
        </div>
      </form>
    </section>
    <ContactGrid :data="contacts" :columns="columns" :filter-key="searchQuery">
    </ContactGrid>
  </main>
  <footer>
    <hr>
    &copy; 2022 <a href="https://metatooth.com">Metatooth LLC</a>
  </footer>
</template>

<style>
h1 {
    color: #00bbee;
}

.section {
  margin-bottom: 10px;
}

footer {
  text-align: center;
  font-size: small;
}
</style>
