<script lang="ts">
export default {
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
  },
  data() {
    return {
      sortKey: this.columns[0],
      sortOrders: this.columns.reduce((o, key) => ((o[key] = 1), o), {}),
    };
  },
  computed: {
    filtered() {
      const { sortKey } = this;
      const filterKey = this.filterKey && this.filterKey.toLowerCase();
      const order = this.sortOrders[sortKey] || 1;
      let data = this.data || [];
      if (filterKey) {
        data = data.filter((row) => Object.keys(row).some((key) => String(row[key]).toLowerCase().indexOf(filterKey) > -1));
      }
      if (sortKey) {
        data = data.slice().sort((a, b) => {
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        });
      }
      return data;
    },
  },
  methods: {
    sortBy(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
};
</script>

<template>
  <table class="table" v-if="filtered.length">
    <thead>
      <tr>
        <th v-for="key in columns"
            :key="key"
            @click="sortBy(key)"
            :class="{ active: sortKey == key }">
          {{ capitalize(key) }}
          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in filtered" :key="entry.id">
        <td v-for="key in columns" :key="key">
          {{ entry[key] }}
        </td>
      </tr>
    </tbody>
  </table>
  <p v-else>No matches found.</p>
</template>

<style>
table {
  border: 3px solid #00bbee;
  border-radius: 5px;
}

th {
  background-color: #00bbee;
  color: rgba(255, 255, 255, 0.88);
  cursor: pointer;
  user-select: none;
  font-family: Sans-Serif;
  border-radius: 5px;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}
</style>
