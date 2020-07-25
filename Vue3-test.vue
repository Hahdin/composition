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
import { useApi } from './utils/api.js';
import { onMounted, reactive } from "@vue/composition-api";
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

    const { api } = useApi(state);

    const { updateData, removeData } = useDataFunctions(state);

    const { customLabel, loadSelections } = useSelections(state, api);

    return {
      state,
      updateData,
      removeData,
      customLabel,
    }
  }
};

/**
 * Data functions
 */
const useDataFunctions = (state) => {
  const updateData = () => {
    const list = state.selectedData.map(data => `[${data.name} : $${data.price}]`);
    const newItem = `update: selected ${list}  @ ${new Date().toString()} `;
    state.history.push(newItem);
  }
  const removeData = (value, id) => {
    state.history.push(`removing "${value.name}"`);
  }
  return {
    updateData,
    removeData,
  }

}

/**
 * Selection functions
 */
const useSelections = (state, api) => {
  const customLabel = (selection) => {
    return `${selection.name} :  $${selection.price}`;
  }
  const loadSelections = async () => {
    state.selections = await api('/api/get-options', 'GET');
  }
  return {
    customLabel,
    loadSelections,
  }
}

</script>
