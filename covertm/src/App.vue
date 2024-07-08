<template>
  <el-container id="app">
    <el-main>
      <Home />
      <canvas style="position:fixed; top:0; left:0; width:100vw; height: 100vh; z-index: -1;"></canvas>
    </el-main>
    <el-footer id="app-footer">
      <div>
        Only supports NetEase Cloud Music(.ncm),QQ Music(.qmc, .mflac, .mgg),KuGou(.kgm),Xiami(.xm),Kuwo(.kwm)...
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import FileSelector from '@/component/FileSelector';
import PreviewTable from '@/component/PreviewTable';
import Home from '@/view/Home';

export default {
  name: 'app',
  components: {
    FileSelector,
    PreviewTable,
    Home,
  },
  created() {
    this.$nextTick(() => this.finishLoad());
  },
  mounted() {
    this.addMouseEventListeners();
  },
  methods: {
    async finishLoad() {
      const mask = document.getElementById('loader-mask');
      if (mask) mask.remove();
      this.$notify.info({
        title: 'Convert music',
        message: `<div>
                    <p>if can't work,please use new</p>
                    <div class="update-info">
                        <div class="update-title">New version by react</div>
                       <a href="https://um.o-x.icu">click here</a>
                    </div>
                </div>`,
        dangerouslyUseHTMLString: true,
        duration: 2000,
        position: 'top-left',
      });
    },
    addMouseEventListeners() {
      const canvas = this.$el.querySelector('canvas');
      const mouseEvents = ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout'];
      mouseEvents.forEach(eventType => {
        document.addEventListener(eventType, (event) => {
          if (event.target !== canvas) {
            const clonedEvent = new MouseEvent(event.type, event);
            canvas.dispatchEvent(clonedEvent);
          }
        });
      });
    },
  },
};
</script>

<style lang="scss">
@import 'scss/comusic';
</style>