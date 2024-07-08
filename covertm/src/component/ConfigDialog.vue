<style scoped>
label {
  cursor: pointer;
  line-height: 1.2;
  display: block;
}

form >>> input {
  font-family: 'Courier New', Courier, monospace;
}

* >>> .um-config-dialog {
  max-width: 90%;
  width: 40em;
}
</style>

<template>
  <el-dialog @close="cancel()" title="for joox" :visible="show" custom-class="um-config-dialog" center>
    <el-form ref="form" :rules="rules" status-icon :model="form" label-width="0">
      <section>
        <label>
          <span>
            JOOX Music ·
            <Ruby >Device Unique Identifier</Ruby>
          </span>
          <el-form-item prop="jooxUUID">
            <el-input type="text" v-model="form.jooxUUID" clearable maxlength="32" show-word-limit> </el-input>
          </el-form-item>
        </label>

        <p class="tip">
          use (adb logcat -e "getOpenUUID") in computer ,then clear joox data and open joox to get the UUID
          <br><a href="https://developer.android.com/studio/releases/platform-tools#downloads" target="_blank">Download adb tool</a>
        </p>
      </section>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="saving" @click="emitConfirm()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { storage } from '@/utils/storage';
import Ruby from './Ruby';

// FIXME: 看起来不会触发这个验证提示？
function validateJooxUUID(rule, value, callback) {
  if (!value || !/^[\da-fA-F]{32}$/.test(value)) {
    callback(new Error('无效的 Joox UUID，请参考 Wiki 获取。'));
  } else {
    callback();
  }
}

const rules = {
  jooxUUID: { validator: validateJooxUUID, trigger: 'change' },
};

export default {
  components: {
    Ruby,
  },
  props: {
    show: { type: Boolean, required: true },
  },
  data() {
    return {
      rules,
      saving: false,
      form: {
        jooxUUID: '',
      },
      centerDialogVisible: false,
    };
  },
  async mounted() {
    await this.resetForm();
  },
  methods: {
    async resetForm() {
      this.form.jooxUUID = await storage.loadJooxUUID();
    },

    async cancel() {
      await this.resetForm();
      this.$emit('done');
    },

    async emitConfirm() {
      this.saving = true;
      await storage.saveJooxUUID(this.form.jooxUUID);
      this.saving = false;
      this.$emit('done');
    },
  },
};
</script>
