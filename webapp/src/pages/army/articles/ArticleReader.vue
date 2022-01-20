<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <div class="container">
          <Common-PageDevideHeight />

          <!-- 文章内容 -->
          <div v-show="!pagestatus.loading" class="j-m">
            <div class="article">
              <div class="title">
                {{ data.articleinfo.policyTitle || '' }}
              </div>

              <Common-PageDevideHeight />

              <!-- 来源 时间 阅读量 -->
              <div class="j-flex j-fc-gray">
                <div class="flex">
                  <span class="source-block">
                    {{ data.articleinfo.createTime || '' }}
                  </span>
                  <span
                    v-show="data.articleinfo.policySource"
                    class="source-divide-pd"
                  >|</span>

                  <span class="source-block">
                    {{ data.articleinfo.policySource || '' }}
                  </span>
                </div>

                <div class="viewcount">
                  <span class="fas fa-eye"></span> 浏览次数：{{ data.articleinfo.viewNumber || '0' }}
                </div>
              </div>

              <Common-PageDevideHeight />
              <div class="van-hairline--bottom"></div>
              <Common-PageDevideHeight />

              <div ref="articlecontent">
                <div
                  class="content"
                  v-html="data.articleinfo.policyDetail"
                ></div>

                <!-- 附件列表 v-if="data.articleinfo.files.length > 0" -->
                <div class="content">
                  <div class="extendsfile-title">附件：</div>
                  <img
                    v-for="(item,index) in data.articleinfo.files"
                    :key="index"
                    :src="item.path"
                  />
                </div>
              </div>

            </div>

            <div v-if="data.articleinfo.preId">
              <Common-PageDevideHeight />
              <router-link
                :to="'/army/policy/reader/' + data.articleinfo.preId"
                class="j-fc-blue relation-article"
              >
                <div class="van-ellipsis">
                  上一条：{{ data.articleinfo.preTitle || '' }}
                </div>
              </router-link>
              <Common-PageDevideHeight />
            </div>

            <div v-if="data.articleinfo.nextId">
              <Common-PageDevideHeight />
              <router-link
                :to="'/army/policy/reader/' + data.articleinfo.nextId"
                class="j-fc-blue relation-article"
              >
                <div class="van-ellipsis">
                  下一条：{{ data.articleinfo.nextTitle || '' }}
                </div>
              </router-link>
              <Common-PageDevideHeight />
            </div>
          </div>

          <!-- 加载中骨架 -->
          <div v-if="pagestatus.loading">
            <van-skeleton title :row="2" />
            <Common-PageDevideHeight />
            <van-skeleton title :row="6" />
          </div>

          <Common-PageDevideHeight />
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      // 页面状态控制
      pagestatus: {
        loading: true
      },

      // 数据存放对象
      data: {
        // 文字内容
        articleinfo: {
          // policyTitle: '省退役军人事务厅召开党史学习教育动员部署会',
          // policySource: '省退役军人事务厅',
          // createTime: '2021-5-10',
          // view_number: 8892,
          // policyDetail: `
          // <p>
          //   <img src="/img/img_fj2@3x.8a4a37b7.png">
          // </p>

          // <p>春节将至，为了将疫情防控和稳增促投两手抓、稳就业与保产业相结合，1月4日晚，浙江省出台《关于支持工业企业留工优工稳增促投的若干意见》。</p>

          // <p>表格</p>
          // <table>
          //   <tbody>
          //     <tr>
          //       <td>1</td>
          //       <td>2</td>
          //       <td>3</td>
          //       <td>4</td>
          //     </tr>
          //   </tbody>
          // </table>

          // <p></p>
          // `
        },

        // 文字内的图片列表
        piclist: []
      }
    }
  },

  computed: mapState({
    // 登录用户ID
    userId () {
      return this.Userinfo.id
    },

    // 当前登录用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    }
  }),

  mounted () {
    this.F_loadArticle()
  },

  watch: {
    '$route.params.articleid' () {
      this.F_loadArticle()
    }
  },

  methods: {
    // 加载文章
    async F_loadArticle () {
      this.pagestatus.loading = true
      this.data.piclist = []

      const articleData = await this.$Api.army.policy.getDetail(this.$route.params.articleid)

      if (articleData.code === 2000) {
        this.data.articleinfo = articleData.result

        this.pagestatus.loading = false

        this.F_updateViewCount()

        // 延迟处理等待 dom加载完成
        setTimeout(() => {
          this.F_imgPreviewer()
        }, 100)

        return
      }

      this.$toast('数据请求失败，请稍后重试')
    },

    // 更新阅读量
    F_updateViewCount () {
      this.$Api.army.policy.updateViewCount({
        userId: this.userId,
        type: 1,
        objectId: this.data.articleinfo.id
      })
    },

    // 初始化图片预览
    F_imgPreviewer () {
      const imglist = this.$refs.articlecontent.querySelectorAll('img')

      // 绑定原始事件 浏览器自动回收
      for (let i = 0; i < imglist.length; i++) {
        this.data.piclist.push(imglist[i].src)

        imglist[i]._CusIndexId = i

        imglist[i].onclick = (evt) => {
          console.log(evt)
          this.F_openImg(evt.target._CusIndexId)
        }
      }
    },

    // 打开图片预览
    F_openImg (index) {
      ImagePreview({
        images: this.data.piclist,
        startPosition: index
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: #FFF;
}

.extendsfile-title{
  font-size: 18px;
  margin: 8px 0;
}

.article{
  line-height: 1.6;

  .title{
    font-size: 18px;
  }

  .source-block{
    display: inline-block;
  }

  .source-divide-pd{
    display: inline-block;
    padding: 0 4px;
  }

  .viewcount{
    margin-left: 10px;
  }

  .content{
    font-size: 14px;
  }
}

.relation-article{
  font-size: 14px;
}
</style>

<style scoped>
.content >>> img{
  max-width: 100%;
}

.content >>> table{
  width: 100%;
  border-collapse:collapse;
}

.content >>> table td,
.content >>> table tr{
  border: 1px solid #ebedf0;
}
</style>
