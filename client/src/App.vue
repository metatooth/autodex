<script lang="ts">
import { Contact } from '../../shared/types';
import ContactGrid from './components/ContactGrid.vue';
import appPackage from '../../package.json';

const API_URL = 'http://localhost:8888';

export default {
  data() {
    return {
      contacts: [],
      columns: ['organization', 'address1', 'city', 'statecode', 'postcode', 'phone1', 'contact', 'email'],
      searchQuery: '',
    };
  },

  components: {
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
      console.log("found", n);
      if (n) {
        this.contacts.splice(n, 1);
      }
    }
  },
};
</script>

<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-brand">
        <a class="navbar-item has-text-primary">
          <img src="/logo.png" width="25">&nbsp;Autodex
        </a>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <p class="control has-icons-left">
            <input class="input is-rounded" type="text" placeHolder="Search your contacts" v-model="searchQuery"/>
            <span class="icon is-left has-text-primary">
              <font-awesome-icon icon="search"/>
            </span>
          </p>
        </div>
      </div>
    </nav>
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
