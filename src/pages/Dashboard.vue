<template>
  <div class="d-flex vh-100">
    <!-- Sidebar -->
    <ul class="list-group w-25">
      <li
        class="list-group-item list-group-item-action"
        :class="{ 'active bg-secondary text-white': activeTable === 'devices' }"
        @click="switchTable('devices')"
        style="cursor: pointer;"
      >
        Tabla móviles
      </li>
      <li
        class="list-group-item list-group-item-action"
        :class="{ 'active bg-secondary text-white': activeTable === 'operators' }"
        @click="switchTable('operators')"
        style="cursor: pointer;"
      >
        Tabla operadoras
      </li>
      <li
        class="list-group-item list-group-item-action"
        :class="{ 'active bg-secondary text-white': activeTable === 'models' }"
        @click="switchTable('models')"
        style="cursor: pointer;"
      >
        Modelos móviles
      </li>
    </ul>

    <!-- Main content -->
    <div class="flex-fill bg-light p-4 d-flex flex-column">
      <!-- Header with action buttons -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>{{ tableConfig[activeTable].title }}</h2>
        <div>
          <button v-if="canAdd" class="btn btn-success me-2" @click="openAdd">Agregar</button>
          <button v-if="canEdit" class="btn btn-warning me-2" :disabled="!selectedItem" @click="openEdit">Modificar</button>
          <button v-if="canDelete" class="btn btn-danger" :disabled="!selectedItem" @click="confirmDelete">Eliminar</button>
        </div>
      </div>

      <!-- Data table -->
      <div class="table-responsive flex-fill bg-white p-3 rounded shadow">
        <table class="table table-bordered table-hover mb-0">
          <thead class="table-primary">
            <tr>
              <th v-for="col in tableConfig[activeTable].columns" :key="col.key">
                {{ col.header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item[tableConfig[activeTable].columns[0].key]"
              @click="selectItem(item)"
              :class="{ 'table-active': isSelected(item) }"
              style="cursor: pointer;"
            >
              <td v-for="col in tableConfig[activeTable].columns" :key="col.key">
                {{ item[col.key] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Add/Edit -->
    <div v-if="showModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <form class="modal-content" @submit.prevent="submitForm">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3" v-for="field in modalFields" :key="field.key">
              <label class="form-label">{{ field.header }}</label>
              <select
                v-if="field.type === 'select'"
                class="form-select"
                v-model="formData[field.key]"
                required
              >
                <option v-for="opt in field.options" :value="opt.value">{{ opt.text }}</option>
              </select>
              <input
                v-else
                type="text"
                class="form-control"
                v-model="formData[field.key]"
                required
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn btn-primary">{{ modalMode === 'add' ? 'Crear' : 'Guardar' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import axios from 'axios'

// Configurar base URL y token
axios.defaults.baseURL = 'http://127.0.0.1:8000'
const token = localStorage.getItem('token')
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

// Roles y permisos
const userRole = ref(localStorage.getItem('userRole') || '')
const userRoleId = ref(+localStorage.getItem('userRoleId') || 0)
const canAdd = computed(() => ['Administrador', 'Gestor'].includes(userRole.value))
const canEdit = canAdd
const canDelete = computed(() => userRoleId.value === 1)

// Estado y configuración
const activeTable = ref('devices')
const items = ref([])
const selectedItem = ref(null)
const showModal = ref(false)
const modalMode = ref('add')
const formData = reactive({})
const operatorsOptions = ref([])
const modelsOptions = ref([])

// Configuración de tablas
const tableConfig = {
  devices: {
    title: 'Dispositivos',
    buttonText: 'dispositivo',
    columns: [
      { header: 'ID', key: 'id_movil' },
      { header: 'Número', key: 'numero' },
      { header: 'Operadora', key: 'id_operadora' },
      { header: 'Modelo', key: 'id_modelo' }
    ],
    endpoint: '/moviles/'
  },
  operators: {
    title: 'Operadoras',
    buttonText: 'operadora',
    columns: [
      { header: 'ID', key: 'id_operadora' },
      { header: 'Nombre', key: 'nombre' }
    ],
    endpoint: '/operadoras/'
  },
  models: {
    title: 'Modelos Móviles',
    buttonText: 'modelo',
    columns: [
      { header: 'ID', key: 'id_modelo' },
      { header: 'Nombre', key: 'nombre' },
      { header: 'Marca', key: 'marca' },
      { header: 'Año Fabricación', key: 'año_fabricacion' }
    ],
    endpoint: '/modelos/'
  }
}

// Excluir ID en formulario
const modalFields = computed(() => {
  const cols = tableConfig[activeTable.value].columns
  const idKey = cols[0].key
  return cols.filter(col => col.key !== idKey).map(col => {
    if (activeTable.value === 'devices' && col.key === 'id_operadora') {
      return { ...col, type: 'select', options: operatorsOptions.value }
    }
    if (activeTable.value === 'devices' && col.key === 'id_modelo') {
      return { ...col, type: 'select', options: modelsOptions.value }
    }
    return { ...col, type: 'input', options: [] }
  })
})

// Título dinámico del modal
const modalTitle = computed(() =>
  `${modalMode.value === 'add' ? 'Agregar ' : 'Modificar '} ${tableConfig[activeTable.value].buttonText}`
)

// Helpers
function switchTable(table) {
  activeTable.value = table
  selectedItem.value = null
}
function selectItem(item) {
  selectedItem.value = item
}
function isSelected(item) {
  const key = tableConfig[activeTable.value].columns[0].key
  return selectedItem.value?.[key] === item[key]
}

// Fetch data
async function fetchItems() {
  const res = await axios.get(tableConfig[activeTable.value].endpoint)
  items.value = res.data
}
async function fetchOptions() {
  try {
    const [opsRes, modsRes] = await Promise.all([
      axios.get(tableConfig.operators.endpoint),
      axios.get(tableConfig.models.endpoint)
    ])
    operatorsOptions.value = Array.isArray(opsRes.data)
      ? opsRes.data.map(o => ({ value: o.id_operadora, text: o.nombre }))
      : []
    modelsOptions.value = Array.isArray(modsRes.data)
      ? modsRes.data.map(m => ({ value: m.id_modelo, text: m.nombre }))
      : []
  } catch (e) {
    console.error('Error cargando opciones:', e)
    operatorsOptions.value = []
    modelsOptions.value = []
  }
}

// Modal controls
function openAdd() {
  modalMode.value = 'add'
  Object.keys(formData).forEach(k => delete formData[k])
  modalFields.value.forEach(f => {
    formData[f.key] = f.type === 'select' ? f.options[0]?.value : ''
  })
  showModal.value = true
}
function openEdit() {
  if (!selectedItem.value) return
  modalMode.value = 'edit'
  Object.assign(formData, selectedItem.value)
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}

// CRUD actions
async function submitForm() {
  const cfg = tableConfig[activeTable.value]
  if (modalMode.value === 'add') {
    await axios.post(cfg.endpoint, formData)
  } else {
    const key = tableConfig[activeTable.value].columns[0].key
    await axios.put(`${cfg.endpoint}${formData[key]}/`, formData)
  }
  if (activeTable.value === 'operators' || activeTable.value === 'models') {
    await fetchOptions()
  }
  await fetchItems()
  closeModal()
  selectedItem.value = null
}
async function confirmDelete() {
  if (!selectedItem.value) return
  const key = tableConfig[activeTable.value].columns[0].key
  if (confirm(`¿Eliminar registro ${selectedItem.value[key]}?`)) {
    await axios.delete(`${tableConfig[activeTable.value].endpoint}${selectedItem.value[key]}/`)
    await fetchItems()
    selectedItem.value = null
  }
}

// Ciclo de vida
onMounted(async () => {
  await fetchOptions()
  await fetchItems()
})
watch(activeTable, fetchItems)
</script>

<style scoped>
</style>
