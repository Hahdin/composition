<template>
  <div>
    <h2>Test</h2>
    <hr />
    <div
      v-if="loading"
    >
      Loading, please wait...
    </div>
    <multiselect
      v-model="selectedData"
      :multiple="true"
      :close-on-select="false"
      :custom-label="customLabel"
      :options="selections"
      track-by="name"
      @close="updateData"
      @remove="removeData"
    ></multiselect>
    <hr />
    <div>
      <h4>History</h4>
      <ul>
        <li v-for="item in history" :key="item.id">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import "vue-multiselect/dist/vue-multiselect.min.css";
import _ from "lodash";
import Multiselect from "vue-multiselect";
export default {
  components: {
    Multiselect
  },
  data() {
    return {
      selectedData: [],
      selections: [],
      history: [],
      loading: false,
    };
  },
  mounted() {
    this.loadSelections();
  },
  methods: {
    loadSelections() {
      this.api('/api/get-options', 'GET')
      .then((data) => {
        this.selections = data;
      });

    },
    api(url, type) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        const req = $.ajax({
          url,
          type,
        });

        req.done((data) => {
          resolve(data);
        });

        req.fail((error) => {
          console.log(error);
          reject(error);
        });

        req.always(() => {
          this.loading = false;
        });
      });
    },
    customLabel(selection) {
      return `${selection.name} :  $${selection.price}`;
    },
    updateData(value, id) {
      this.updateList("update");
    },
    removeData(value, id) {
      this.history.push(`removing "${value.name}"`);
    },
    updateList(action) {
      const list = state.selectedData.map(data => `[${data.name} : $${data.price}]`);
      const newItem = `${action}: selected ${list}  @ ${new Date().toString()} `;
      this.history.push(newItem);
    }
  }
};
</script>

<style>
</style>
