<template>
  <div>
    <file-selector @error="showFail" @success="showSuccess" />

    <div id="app-control">
      <el-row class="mb-3">
        <span>Song Naming Format:</span>
        <el-radio v-for="k in FilenamePolicies" :key="k.key" v-model="filename_policy" :label="k.key">
          {{ k.text }}
        </el-radio>
      </el-row>
      <el-row>
        <edit-dialog
          :show="showEditDialog"
          :picture="editing_data.picture"
          :title="editing_data.title"
          :artist="editing_data.artist"
          :album="editing_data.album"
          :albumartist="editing_data.albumartist"
          :genre="editing_data.genre"
          @cancel="showEditDialog = false"
          @ok="handleEdit"
        ></edit-dialog>
        <config-dialog :show="showConfigDialog" @done="showConfigDialog = false"></config-dialog>
        <el-tooltip class="item" effect="dark" placement="top">
          <div slot="content">
            <span>Some decryption schemes require setting decryption parameters.</span>
          </div>
          <el-button icon="el-icon-s-tools" plain @click="showConfigDialog = true">Decryption Settings</el-button>
        </el-tooltip>
        <el-button icon="el-icon-download" plain @click="handleDownloadAll">Download All</el-button>
        <el-button icon="el-icon-delete" plain type="danger" @click="handleDeleteAll">Clear All</el-button>

        <el-tooltip class="item" effect="dark" placement="top-start">
          <div slot="content">
            <span v-if="instant_save">Working Mode: {{ dir ? 'Write to Local File System' : 'Invoke Browser Download' }}</span>
            <span v-else>
              When you use this tool for a large number of file conversions, it is recommended to enable this option.<br />
              When enabled, the conversion results will not be stored in the browser to prevent insufficient memory.
            </span>
          </div>
          <el-checkbox v-model="instant_save" type="success" border class="ml-2">Save Immediately</el-checkbox>
        </el-tooltip>
      </el-row>
    </div>

    <audio :autoplay="playing_auto" :src="playing_url" controls />

    <PreviewTable
      class="table-content"
      :policy="filename_policy"
      :table-data="tableData"
      @download="saveFile"
      @edit="editFile"
      @play="changePlaying" />
  </div>
</template>

<script>
import FileSelector from '@/component/FileSelector';
import PreviewTable from '@/component/PreviewTable';
import ConfigDialog from '@/component/ConfigDialog';
import EditDialog from '@/component/EditDialog';

import { DownloadBlobMusic, FilenamePolicy, FilenamePolicies, RemoveBlobMusic, DirectlyWriteFile } from '@/utils/utils';
import { GetImageFromURL, RewriteMetaToMp3, RewriteMetaToFlac, AudioMimeType, split_regex } from '@/decrypt/utils';
import { parseBlob as metaParseBlob } from 'music-metadata-browser';

export default {
  name: 'Home',
  components: {
    FileSelector,
    PreviewTable,
    ConfigDialog,
    EditDialog,
  },
  data() {
    return {
      showConfigDialog: false,
      showEditDialog: false,
      editing_data: { picture: '', title: '', artist: '', album: '', albumartist: '', genre: '' },
      tableData: [],
      playing_url: '',
      playing_auto: false,
      filename_policy: FilenamePolicy.ArtistAndTitle,
      instant_save: false,
      FilenamePolicies,
      dir: null,
    };
  },
  watch: {
    instant_save(val) {
      if (val) this.showDirectlySave();
    },
  },
  methods: {
    async showSuccess(data) {
      if (this.instant_save) {
        await this.saveFile(data);
        RemoveBlobMusic(data);
      } else {
        this.tableData.push(data);
        this.$notify.success({
          title: 'Conversion Successful',
          message: 'Successfully converted ' + data.title,
          duration: 3000,
        });
      }
      if (process.env.NODE_ENV === 'production') {
        let _rp_data = [data.title, data.artist, data.album];
        window._paq.push(['trackEvent', 'Unlock', data.rawExt + ',' + data.mime, JSON.stringify(_rp_data)]);
      }
    },
    showFail(errInfo, filename) {
      console.error(errInfo, filename);
      this.$notify.error({
        title: 'Problem Occurred',
        message:
          errInfo +
          ', ' +
          filename +
          ', <a target="_blank" href="mailto:i@o-x.icu">Click to provide feedback</a>',
        dangerouslyUseHTMLString: true,
        duration: 6000,
      });
      if (process.env.NODE_ENV === 'production') {
        window._paq.push(['trackEvent', 'Error', String(errInfo), filename]);
      }
    },
    changePlaying(url) {
      this.playing_url = url;
      this.playing_auto = true;
    },
    handleDeleteAll() {
      this.tableData.forEach((value) => {
        RemoveBlobMusic(value);
      });
      this.tableData = [];
    },
    handleDecryptionConfig() {
      this.showConfigDialog = true;
    },
    handleDownloadAll() {
      let index = 0;
      let c = setInterval(() => {
        if (index < this.tableData.length) {
          this.saveFile(this.tableData[index]);
          index++;
        } else {
          clearInterval(c);
        }
      }, 300);
    },
    async handleEdit(data) {
      this.showEditDialog = false;
      URL.revokeObjectURL(this.editing_data.file);
      if (data.picture) {
        URL.revokeObjectURL(this.editing_data.picture);
        this.editing_data.picture = URL.createObjectURL(data.picture);
      }
      this.editing_data.title = data.title;
      this.editing_data.artist = data.artist;
      this.editing_data.album = data.album;
      let writeSuccess = true;
      let notifyMsg = 'Successfully modified ' + this.editing_data.title;
      try {
        const musicMeta = await metaParseBlob(new Blob([this.editing_data.blob], { type: mime }));
        let imageInfo = undefined;
        if (this.editing_data.picture !== '') {
          imageInfo = await GetImageFromURL(this.editing_data.picture);
          if (!imageInfo) {
            console.warn('Failed to retrieve image', this.editing_data.picture);
          }
        }
        const newMeta = {
          picture: imageInfo?.buffer,
          title: data.title,
          artists: data.artist.split(split_regex),
          album: data.album,
          albumartist: data.albumartist,
          genre: data.genre.split(split_regex),
        };
        const buffer = Buffer.from(await this.editing_data.blob.arrayBuffer());
        const mime = AudioMimeType[this.editing_data.ext] || AudioMimeType.mp3;
        if (this.editing_data.ext === 'mp3') {
          this.editing_data.blob = new Blob([RewriteMetaToMp3(buffer, newMeta, musicMeta)], { type: mime });
        } else if (this.editing_data.ext === 'flac') {
          this.editing_data.blob = new Blob([RewriteMetaToFlac(buffer, newMeta, musicMeta)], { type: mime });
        } else {
          writeSuccess = undefined;
          notifyMsg = 'Modifying music tags for ' + this.editing_data.ext + ' files is not supported at the moment.';
        }
      } catch (e) {
        writeSuccess = false;
        notifyMsg = 'Failed to complete the modification for ' + this.editing_data.title + '. Error occurred while writing new metadata: ' + e;
      }
      this.editing_data.file = URL.createObjectURL(this.editing_data.blob);
      if (writeSuccess === true) {
        this.$notify.success({
          title: 'Modification Successful',
          message: notifyMsg,
          duration: 3000,
        });
      } else if (writeSuccess === false) {
        this.$notify.error({
          title: 'Modification Failed',
          message: notifyMsg,
          duration: 3000,
        });
      } else {
        this.$notify.warning({
          title: 'Modification Cancelled',
          message: notifyMsg,
          duration: 3000,
        });
      }
    },

    async editFile(data) {
      this.editing_data = data;
      const musicMeta = await metaParseBlob(this.editing_data.blob);
      this.editing_data.albumartist = musicMeta.common.albumartist || '';
      this.editing_data.genre = musicMeta.common.genre?.toString() || '';
      this.showEditDialog = true;
    },
    async saveFile(data) {
      if (this.dir) {
        await DirectlyWriteFile(data, this.filename_policy, this.dir);
        this.$notify({
          title: 'Save Successful',
          message: data.title,
          position: 'top-left',
          type: 'success',
          duration: 3000,
        });
      } else {
        DownloadBlobMusic(data, this.filename_policy);
      }
    },
    async showDirectlySave() {
      if (!window.showDirectoryPicker) return;
      try {
        await this.$confirm('Your browser supports saving files directly to disk. Do you want to use it?', 'New Feature Prompt', {
          confirmButtonText: 'Use',
          cancelButtonText: 'Don\'t Use',
          type: 'warning',
          center: true,
        });
      } catch (e) {
        console.log(e);
        return;
      }
      try {
        this.dir = await window.showDirectoryPicker();
        const test_filename = '__unlock_music_write_test.txt';
        await this.dir.getFileHandle(test_filename, { create: true });
        await this.dir.removeEntry(test_filename);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
