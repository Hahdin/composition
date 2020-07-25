<template>
  <div>
    <h2>Test</h2>
    <hr />
    <div
      v-if="state.loading"
    >
      Loading, please wait...
    </div>
    <multiselect
      v-model="state.selectedData"
      :multiple="true"
      :close-on-select="false"
      :custom-label="customLabel"
      :options="state.selections"
      track-by="name"
      @close="updateData"
      @remove="removeData"
    ></multiselect>
    <hr />
    <div>
      <h4>History</h4>
      <ul>
        <li v-for="item in state.history" :key="item.id">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { onMounted, reactive } from "@vue/composition-api";
import $ from "jquery";
import "vue-multiselect/dist/vue-multiselect.min.css";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Multiselect
  },

  setup() {
    const state = reactive({
      loading: false,
      selectedData: [],
      selections: [],
      history: [],
    })

    onMounted(() => {
      loadSelections();
    })

    const updateData = () => {
      updateList("update");
    }

    const removeData = (value, id) => {
      state.history.push(`removing "${value.name}"`);
    }

    const customLabel = (selection) => {
      return `${selection.name} :  $${selection.price}`;
    }
    const updateList = (action) => {
      const list = state.selectedData.map(data => `[${data.name} : $${data.price}]`);
      const newItem = `${action}: selected ${list}  @ ${new Date().toString()} `;
      state.history.push(newItem);
    }

    const loadSelections = async () => {
      state.selections = await api('/api/get-options', 'GET');
    }

    const api = (url, type, data = null) => {
      return new Promise((resolve, reject) => {
        state.loading = true;
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
          state.loading = false;
        });
      });
    }

    return {
      state,
      updateData,
      removeData,
      customLabel,
      updateList,
      loadSelections,
      api,
    }
  }
};
</script>
