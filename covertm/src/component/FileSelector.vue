<template>
  <el-upload :auto-upload="false" :on-change="addFile" :show-file-list="false" action="" drag multiple>
    <i class="el-icon-upload" />
    <div class="el-upload__text">Drag files here or <em>click to select</em></div>
    <div slot="tip" class="el-upload__tip">
      <div>
        Unlock files in the browser without consuming data traffic
        <el-tooltip effect="dark" placement="top-start">
          <div slot="content">The algorithm is provided in the source code, and all computations happen locally</div>
          <i class="el-icon-info" style="font-size: 12px" />
        </el-tooltip>
      </div>
      <div>
        Working mode: {{ parallel ? 'Multi-threaded Worker' : 'Single-threaded Queue' }}
        <el-tooltip effect="dark" placement="top-start">
          <div slot="content">
            Deploy this tool in an HTTPS environment to enable Web Worker feature,
            <br />
            which allows faster unlocking through parallel processing
          </div>
          <i class="el-icon-info" style="font-size: 12px" />
        </el-tooltip>
      </div>
    </div>
    <transition name="el-fade-in"
      ><!--todo: add delay to animation-->
      <el-progress
        v-show="progress_show"
        :format="progress_string"
        :percentage="progress_value"
        :stroke-width="16"
        :text-inside="true"
        style="margin: 16px 6px 0 6px"
      ></el-progress>
    </transition>
  </el-upload>
</template>

<script>
import { spawn, Worker, Pool } from 'threads';
import { Decrypt } from '@/decrypt';
import { DecryptQueue } from '@/utils/utils';
import { storage } from '@/utils/storage';

export default {
  name: 'FileSelector',
  data() {
    return {
      task_all: 0,
      task_finished: 0,
      queue: new DecryptQueue(), // for http or file protocol
      parallel: false,
    };
  },
  computed: {
    progress_value() {
      return this.task_all ? (this.task_finished / this.task_all) * 100 : 0;
    },
    progress_show() {
      return this.task_all !== this.task_finished;
    },
  },
  mounted() {
    if (window.Worker && window.location.protocol !== 'file:' && process.env.NODE_ENV === 'production') {
      console.log('Using Worker Pool');
      this.queue = Pool(() => spawn(new Worker('@/utils/worker.ts')), navigator.hardwareConcurrency || 1);
      this.parallel = true;
    } else {
      console.log('Using Queue in Main Thread');
    }
  },
  methods: {
    progress_string() {
      return `${this.task_finished} / ${this.task_all}`;
    },
    async addFile(file) {
      this.task_all++;
      this.queue.queue(async (dec = Decrypt) => {
        console.log('start handling', file.name);
        try {
          this.$emit('success', await dec(file, await storage.getAll()));
        } catch (e) {
          console.error(e);
          this.$emit('error', e, file.name);
        } finally {
          this.task_finished++;
        }
      });
    },
  },
};
</script>
