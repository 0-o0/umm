<template>
  <el-table :data="tableData" empty-text=" " style="width: 100%">
    <el-table-column label="Cover">
      <template slot-scope="scope">
        <el-image :src="scope.row.picture" style="width: 100px; height: 100px">
          <div slot="error" class="image-slot el-image__error">No cover available</div>
        </el-image>
      </template>
    </el-table-column>
    <el-table-column label="Song">
      <template #default="scope">
        <p>{{ scope.row.title }}</p>
      </template>
    </el-table-column>
    <el-table-column label="Artist">
      <template #default="scope">
        <p>{{ scope.row.artist }}</p>
      </template>
    </el-table-column>
    <el-table-column label="Album">
      <template #default="scope">
        <p>{{ scope.row.album }}</p>
      </template>
    </el-table-column>
    <el-table-column label="Actions">
      <template #default="scope">
        <el-button circle icon="el-icon-video-play" type="success" @click="handlePlay(scope.$index, scope.row)">
        </el-button>
        <el-button circle icon="el-icon-download" @click="handleDownload(scope.row)"></el-button>
        <el-button circle icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
        <el-button circle icon="el-icon-delete" type="danger" @click="handleDelete(scope.$index, scope.row)">
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { RemoveBlobMusic } from '@/utils/utils';

export default {
  name: 'PreviewTable',
  props: {
    tableData: { type: Array, required: true },
    policy: { type: Number, required: true },
  },

  methods: {
    handlePlay(index, row) {
      this.$emit('play', row.file);
    },
    handleDelete(index, row) {
      RemoveBlobMusic(row);
      this.tableData.splice(index, 1);
    },
    handleDownload(row) {
      this.$emit('download', row);
    },
    handleEdit(row) {
      this.$emit('edit', row);
    },
  },
};
</script>

<style scoped></style>
