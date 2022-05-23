<script lang="ts">
import { Contact } from '../../shared/types';
import ContactGrid from './components/ContactGrid.vue';
import AutodexNavbar from './components/AutodexNavbar.vue';
import appPackage from '../../package.json';

const API_URL = 'http://localhost:8888';

export default {
  data() {
    return {
      contacts: [],
      columns: ['organization', 'address1', 'city', 'statecode', 'postcode1', 'phone1', 'contact', 'email'],
      searchQuery: '',
    };
  },

  components: {
    AutodexNavbar,
    ContactGrid,
  },

  created() {
    this.fetchData();
  },

  computed: {
    appVersion() {
      return appPackage.version;
    },
  },

  methods: {
    async fetchData() {
      const url = `${API_URL}/contacts`;
      this.contacts = await (await fetch(url)).json();
    },
    async trash(entry: Contact) {
      const url = `${API_URL}/contacts/${entry.id}`;
      const options = { method: "DELETE" };
      fetch(url, options);
      
      const n = this.contacts.indexOf(entry);
      if (n) {
        this.contacts.splice(n, 1);
      }
    },
    async updateQuery(query: string) {
      this.searchQuery = query;
    }
  },
};
</script>

<template>
  <div class="container">
    <AutodexNavbar @query-updated="updateQuery" />
    <ContactGrid :data="contacts" :columns="columns" :filter-key="searchQuery" @trash-contact="trash" >
    </ContactGrid>
    <footer class="footer">
      <hr>
      {{ appVersion }} &copy; 2022 <a href="https://metatooth.com">Metatooth LLC</a>
    </footer>
  </div>
</template>

<style lang="scss">
@import "../assets/main.scss";
</style>
