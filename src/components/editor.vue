<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>


<script>
import OSS  from 'ali-oss'
import E from 'wangeditor'
export default {
  name: 'editoritem',
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null,
    }
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    isClear: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.info_ = null
      }
    },
    value: function (value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value)
      }
    },
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor()
    this.editor.txt.html(this.value)
  },
  methods: {
    seteditor() {
      // http://192.168.2.125:8080/admin/storage/create
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)
      this.editor.config.uploadImgShowBase64 = false // base 64 存储图片
      // 配置服务器端地址
      // this.editor.config.uploadImgServer =
      // 'http://otp.cdinfotech.top/file/upload_images'
      // 自定义 header
      // this.editor.config.uploadImgHeaders = {} 
      // 后端接受上传文件的参数名
      // this.editor.config.uploadFileName = 'file'
      this.editor.config.uploadImgMaxSize = 32 * 1024 * 1024 // 将图片大小限制为 2M
      this.editor.config.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
      this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

      // 配置菜单
      this.editor.config.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'fullscreen', // 全屏
      ]

      // this.editor.config.uploadImgHooks = {
      //   fail: (xhr, editor, result) => {
      //     // 插入图片失败回调
      //   },
      //   success: (xhr, editor, result) => {
      //     // 图片上传成功回调
      //   },
      //   timeout: (xhr, editor) => {
      //     // 网络超时的回调
      //   },
      //   error: (xhr, editor) => {
      //     // 图片上传错误的回调
      //   },
      //   customInsert: (insertImg, result, editor) => {
      //     // 图片上传成功，插入图片的回调
      //     //result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
      //     // console.log(result.data[0].url)
      //     //insertImg()为插入图片的函数
      //     //循环插入图片
      //     //   let url = "http://otp.cdinfotech.top" + result.url;
      //     insertImg(url)
      //     // }
      //   },
      // }

      this.editor.config.onchange = (html) => {
        this.info_ = html // 绑定当前逐渐地值
        this.$emit('change', this.info_) // 将内容同步到父组件中
      }

      // 上传图片到阿里云
      let client = new OSS({
        region: 'oss-cn-shenzhen',
        accessKeyId: 'LTAI5tLfSLUHE511Qu4PnhDJ',
        accessKeySecret: 'pbHsRyQyUio8jz3P6VTMggSckQXxRX',
        bucket: 'bishe-news',
      })

      this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        client
          .put('', resultFiles[0])
          .then(function (res) {
            // 上传图片，返回结果，将图片插入到编辑器中
            insertImgFn(res.url)
            console.log("上传成功");
          })
          .catch(function (err) {
            console.log("上传失败");
            console.log(err)
          })
      }

      // 创建富文本编辑器
      this.editor.create()
    },
  },
}
</script>

<style lang="css">
.editor {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  min-height: 500px;
}
</style>