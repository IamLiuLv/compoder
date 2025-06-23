<template>
  <div class="business-table-container">
    <!-- Table Header Actions -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-2">
        <el-input
          v-model="searchQuery"
          placeholder="Search..."
          class="w-64"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="filterColumn"
          placeholder="Filter Column"
          class="w-40"
        >
          <el-option
            v-for="col in columns"
            :key="col.prop"
            :label="col.label"
            :value="col.prop"
          />
        </el-select>
      </div>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>Add New
      </el-button>
    </div>

    <!-- Main Table -->
    <el-table
      v-loading="loading"
      :data="filteredData"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="50" />

      <template v-for="col in columns" :key="col.prop">
        <el-table-column
          v-bind="col"
          :sortable="col.sortable"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <slot :name="col.prop" :row="scope.row">
              {{ scope.row[col.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>

      <el-table-column label="Actions" width="150" fixed="right">
        <template #default="scope">
          <div class="flex gap-2">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
            >
              Edit
            </el-button>
            <el-popconfirm
              title="Are you sure to delete this record?"
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-button size="small" type="danger"> Delete </el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="flex justify-end mt-4">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, watch } from "vue"
import { Search, Plus } from "@element-plus/icons-vue"

interface Column {
  prop: string
  label: string
  sortable?: boolean
  width?: number | string
}

interface TableItem {
  id: number
  name: string
  date: string
  address: string
  status: string
  [key: string]: any // 添加索引签名，允许使用字符串索引
}

export default defineComponent({
  name: "BusinessTable",

  components: {
    Search,
    Plus,
  },

  setup() {
    // 表格列配置
    const columns = ref<Column[]>([
      { prop: "id", label: "ID", sortable: true, width: 80 },
      { prop: "name", label: "名称", sortable: true },
      { prop: "date", label: "日期", sortable: true },
      { prop: "address", label: "地址" },
      { prop: "status", label: "状态", sortable: true },
    ])

    // 模拟表格数据
    const tableData = ref<TableItem[]>([
      {
        id: 1,
        name: "张三",
        date: "2023-01-01",
        address: "北京市朝阳区",
        status: "活跃",
      },
      {
        id: 2,
        name: "李四",
        date: "2023-01-02",
        address: "上海市浦东新区",
        status: "离线",
      },
      {
        id: 3,
        name: "王五",
        date: "2023-01-03",
        address: "广州市天河区",
        status: "活跃",
      },
      {
        id: 4,
        name: "赵六",
        date: "2023-01-04",
        address: "深圳市南山区",
        status: "离线",
      },
      {
        id: 5,
        name: "钱七",
        date: "2023-01-05",
        address: "杭州市西湖区",
        status: "活跃",
      },
      {
        id: 6,
        name: "孙八",
        date: "2023-01-06",
        address: "成都市武侯区",
        status: "离线",
      },
      {
        id: 7,
        name: "周九",
        date: "2023-01-07",
        address: "重庆市渝中区",
        status: "活跃",
      },
      {
        id: 8,
        name: "吴十",
        date: "2023-01-08",
        address: "南京市鼓楼区",
        status: "离线",
      },
      {
        id: 9,
        name: "郑十一",
        date: "2023-01-09",
        address: "武汉市江汉区",
        status: "活跃",
      },
      {
        id: 10,
        name: "王十二",
        date: "2023-01-10",
        address: "西安市雁塔区",
        status: "离线",
      },
    ])

    // State
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const searchQuery = ref("")
    const filterColumn = ref("")
    const selectedRows = ref<TableItem[]>([])
    const sortConfig = ref({ prop: "", order: "" })

    // Computed
    const filteredData = computed(() => {
      let result = [...tableData.value]

      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(item => {
          if (filterColumn.value) {
            // 按指定列搜索
            const value = String(item[filterColumn.value]).toLowerCase()
            return value.includes(query)
          } else {
            // 全局搜索
            return Object.values(item).some(val =>
              String(val).toLowerCase().includes(query),
            )
          }
        })
      }

      // 排序
      if (sortConfig.value.prop && sortConfig.value.order) {
        const { prop, order } = sortConfig.value
        result.sort((a, b) => {
          const valueA = a[prop]
          const valueB = b[prop]

          if (order === "ascending") {
            return valueA > valueB ? 1 : -1
          } else {
            return valueA < valueB ? 1 : -1
          }
        })
      }

      return result
    })

    // 计算总数
    const total = computed(() => filteredData.value.length)

    // Methods
    const handleSizeChange = (val: number) => {
      pageSize.value = val
    }

    const handleCurrentChange = (val: number) => {
      currentPage.value = val
    }

    const handleSearch = () => {
      currentPage.value = 1 // 重置到第一页
    }

    const handleSortChange = (sort: { prop: string; order: string }) => {
      sortConfig.value = sort
    }

    const handleSelectionChange = (selection: TableItem[]) => {
      selectedRows.value = selection
    }

    const handleDelete = (row: TableItem) => {
      const index = tableData.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        tableData.value.splice(index, 1)
      }
    }

    const handleEdit = (row: TableItem) => {
      console.log("编辑行:", row)
      // 这里可以添加编辑逻辑，例如打开编辑对话框
    }

    const handleAdd = () => {
      const newId =
        tableData.value.length > 0
          ? Math.max(...tableData.value.map(item => item.id)) + 1
          : 1

      tableData.value.push({
        id: newId,
        name: `新用户${newId}`,
        date: new Date().toISOString().split("T")[0],
        address: "待填写",
        status: "活跃",
      })
    }

    return {
      columns,
      loading,
      tableData: filteredData,
      filteredData,
      total,
      currentPage,
      pageSize,
      searchQuery,
      filterColumn,
      selectedRows,
      handleSizeChange,
      handleCurrentChange,
      handleSearch,
      handleSortChange,
      handleSelectionChange,
      handleDelete,
      handleEdit,
      handleAdd,
    }
  },
})
</script>

<style scoped>
.business-table-container {
  @apply w-full bg-white p-4 rounded-lg shadow;
}
</style>
