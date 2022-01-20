<template>
  <div class="character">
    <div class="character-content">
      <div class="character-title">职业性格测试</div>
      <div class="character-message">测试人：{{ name }}</div>
      <div class="character-body" v-if="characterShow">
        <div class="character-body-item">
          <div class="character-body-title">
            <h2>认知你的决策模式/偏好</h2>
            <p>请选择每一题中最符合你思言行特征的选项</p>
          </div>
          <ul class="the-title-list">
            <li
              class="the-title-item"
              v-for="(item, index) in characterObj.characterData1"
              :key="index"
            >
              <div class="the-title-rank">第{{ item.num }}题</div>
              <van-radio-group icon-size="16" v-model="item.value">
                <van-radio :name="k.label" v-for="(k, i) in item.list" :key="i">{{ k.name }}</van-radio>
              </van-radio-group>
            </li>
          </ul>
        </div>
        <div class="character-body-item">
          <div class="character-body-title">
            <h2>认知你的信息获取模式/偏好</h2>
            <p>请选择每一题中最符合你思言行特征的选项</p>
          </div>
          <ul class="the-title-list">
            <li
              class="the-title-item"
              v-for="(item, index) in characterObj.characterData2"
              :key="index"
            >
              <div class="the-title-rank">第{{ item.num }}题</div>
              <van-radio-group icon-size="16" v-model="item.value">
                <van-radio :name="k.label" v-for="(k, i) in item.list" :key="i">{{ k.name }}</van-radio>
              </van-radio-group>
            </li>
          </ul>
        </div>
      </div>
      <div class="btn-box" v-if="characterShow">
        <van-button type="info" :disabled="isResult"  @click="goResult()">查看结果</van-button>
      </div>
      <div class="character-result" v-if="!characterShow">
        <div class="character-result-item">
          <h2 class="character-result-title">{{ name }} 的天性与领导风格</h2>
          <div class="character-result-info">
            <div class="character-title-item intuition">
              直觉：{{ submitResult.intuitionNum }}
            </div>
            <div class="character-title-item logic">
              逻辑：{{ submitResult.logicNum }}
            </div>
            <div class="character-title-item feeling">
              感觉：{{ submitResult.feelNum }}
            </div>
            <div class="character-title-item emotional">
              情感：{{ submitResult.emotionNum }}
            </div>
            <div class="character-box cultivate">
              <div class="character-info character-info-other">
                <div class="character-info-item">
                  <div class="character-left-title">
                    <div class="txt-box">
                      <div class="character-left-txt character-left-txt2">
                        培育型：{{ submitResult.cultivatedType }}
                      </div>
                      <div class="character-left-txt">以人为本</div>
                      <div class="character-left-txt">
                        尊重人的价值<br />
                        有同理心、 关心他人
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="character-box hope">
              <div class="character-info character-info-other">
                <div class="character-info-item">
                  <div class="character-left-title">
                    <div class="txt-box">
                      <div class="character-left-txt character-left-txt2">
                        希望型：{{ submitResult.hopeType }}
                      </div>
                      <div class="character-left-txt">创意的创造者</div>
                      <div class="character-left-txt">
                        关注创意<br />
                        崇尚自由<br />
                        争做最好<br />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="character-box guide">
              <div class="character-info character-info-other">
                <div class="character-info-item">
                  <div class="character-left-title">
                    <div class="txt-box">
                      <div class="character-left-txt character-left-txt2">
                        指导型：{{ submitResult.guidanceType }}
                      </div>
                      <div class="character-left-txt">体系的建维者</div>
                      <div class="character-left-txt">
                        追求结果的确定性注重流程和组织架构
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="character-box harmony">
              <div class="character-info character-info-other">
                <div class="character-info-item">
                  <div class="character-left-title">
                    <div class="txt-box">
                      <div class="character-left-txt character-left-txt2">
                        包融型：{{ submitResult.inclusionType }}
                      </div>
                      <div class="character-left-txt">团队的凝聚者</div>
                      <div class="character-left-txt">
                        营造融洽的关系<br />
                        追求和谐的团队合作
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="character-result-item">
          <h2 class="character-result-title">每种颜色倾向什么</h2>
          <div class="character-result-info">
            <div class="character-title-item intuition">直觉、快、宏观</div>
            <div class="character-title-item logic">逻辑、事</div>
            <div class="character-title-item feeling">感知、慢、微观</div>
            <div class="character-title-item emotional">情感、人</div>
            <div class="character-box cultivate">
              <div class="character-info">
                <div class="character-info-item color-contrast">
                  <div class="info-box">
                    <p>服务他人，</p>
                    <p>深层次的人类价值</p>
                    <p>共鸣，有欣赏力的</p>
                    <p>老师，教练</p>
                    <p>卓越的(具有逻辑能力时)</p>
                    <p><span>当1-D时：</span>过度情绪化，不善组织</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="character-box hope">
              <div class="character-info">
                <div class="character-info-item color-contrast">
                  <div class="info-box">
                    <p>追求卓越，</p>
                    <p>特别是在智力方面</p>
                    <p>批判性思维</p>
                    <p>科学家博士</p>
                    <p>卓越的(具有情商能力)</p>
                    <p><span>当1-D时：</span>过高要求; 好斗的、易怒</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="character-box guide">
              <div class="character-info">
                <div class="character-info-item color-contrast">
                  <div class="info-box">
                    <p>自律、流程、</p>
                    <p>组织</p>
                    <p>循规蹈矩思维</p>
                    <p>工程师，CEO' S</p>
                    <p>卓越的(具有情商能力)</p>
                    <p><span>当1-D时：</span>对他人缺乏同情心</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="character-box harmony">
              <div class="character-info">
                <div class="character-info-item color-contrast">
                  <div class="info-box">
                    <p>人际关系，</p>
                    <p>与人协作</p>
                    <p>遭人喜爱</p>
                    <p>市场，销售</p>
                    <p>卓越的(具有逻辑能力时)</p>
                    <p><span>当1-D时：</span>不能容忍冲突</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-box" v-if="!characterShow">
        <van-button type="info" v-if="isReset" @click="reset()">重新测试</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'character',
  data () {
    return {
      name: '',
      characterShow: true,
      isResult: true,
      characterObj: {
        characterData1: [
          {
            value: null,
            num: '一',
            list: [
              { label: '1', name: '和谐是本质上很重要的东西' },
              { label: '2', name: '和谐是达到目的的一种手段' }
            ]
          },
          {
            value: null,
            num: '二',
            list: [
              { label: '1', name: '喜欢根据“感觉好不好”做事' },
              { label: '2', name: '喜欢根据“合理不合理”做事' }
            ]
          },
          {
            value: null,
            num: '三',
            list: [
              { label: '1', name: '人是首要的考虑因素' },
              { label: '2', name: '工作任务是首要的考虑因素' }
            ]
          },
          {
            value: null,
            num: '四',
            list: [
              { label: '1', name: '以保持和谐关系为重' },
              { label: '2', name: '以遵守正确路线为重' }
            ]
          },
          {
            value: null,
            num: '五',
            list: [
              { label: '1', name: '通过达成共识进行决策' },
              { label: '2', name: '根据自己的想法作出决策' }
            ]
          },
          {
            value: null,
            num: '六',
            list: [
              { label: '1', name: '首先是：相信我自己的感觉' },
              { label: '2', name: '首先是：相信我自己的理智' }
            ]
          },
          {
            value: null,
            num: '七',
            list: [
              { label: '1', name: '接受不了冲突' },
              { label: '2', name: '可以忍受冲突对立' }
            ]
          }
        ],
        characterData2: [
          {
            value: null,
            num: '一',
            list: [
              { label: '1', name: '依靠我自己的内在觉察' },
              { label: '2', name: '依靠我的观察' }
            ]
          },
          {
            value: null,
            num: '二',
            list: [
              { label: '1', name: '更多地考虑“可能会是什么”' },
              { label: '2', name: '更多地考虑“是什么”' }
            ]
          },
          {
            value: null,
            num: '三',
            list: [
              { label: '1', name: '喜欢创造' },
              { label: '2', name: '喜欢常识' }
            ]
          },
          {
            value: null,
            num: '四',
            list: [
              { label: '1', name: '凭灵光一现的洞察力做事' },
              { label: '2', name: '凭仔细分析做事' }
            ]
          },
          {
            value: null,
            num: '五',
            list: [
              { label: '1', name: '喜欢研究概念' },
              { label: '2', name: '喜欢研究事实和数据' }
            ]
          },
          {
            value: null,
            num: '六',
            list: [
              { label: '1', name: '注重全局考虑' },
              { label: '2', name: '注重细节' }
            ]
          },
          {
            value: null,
            num: '七',
            list: [
              { label: '1', name: '喜欢远大的构想' },
              { label: '2', name: '喜欢确定的事实' }
            ]
          }
        ]
      },
      result: {
        emotional: 0,
        logic: 0,
        intuition: 0,
        feeling: 0
      },
      submitResult: {},
      isReset: false
    }
  },
  created () {
    this.name = this.armyInfo.userName
    this.getResult()
  },
  computed: {
    ...mapState({
      armyInfo (state) { // 当前军人用户信息
        return state.localData.armyInfo
      }
    })
  },
  watch: {
    characterObj: {
      handler (newVal) {
        const dataStatus1 = this.getStatus(newVal.characterData1)
        const dataStatus2 = this.getStatus(newVal.characterData2)
        if (dataStatus1 && dataStatus2) {
          this.isResult = false
        } else {
          this.isResult = true
        }
      },
      deep: true
    }
  },
  methods: {
    reset () {
      window.scrollTo(0, 0)
      this.characterObj = {
        characterData1: [
          {
            value: null,
            num: '一',
            list: [
              { label: '1', name: '和谐是本质上很重要的东西' },
              { label: '2', name: '和谐是达到目的的一种手段' }
            ]
          },
          {
            value: null,
            num: '二',
            list: [
              { label: '1', name: '喜欢根据“感觉好不好”做事' },
              { label: '2', name: '喜欢根据“合理不合理”做事' }
            ]
          },
          {
            value: null,
            num: '三',
            list: [
              { label: '1', name: '人是首要的考虑因素' },
              { label: '2', name: '工作任务是首要的考虑因素' }
            ]
          },
          {
            value: null,
            num: '四',
            list: [
              { label: '1', name: '以保持和谐关系为重' },
              { label: '2', name: '以遵守正确路线为重' }
            ]
          },
          {
            value: null,
            num: '五',
            list: [
              { label: '1', name: '通过达成共识进行决策' },
              { label: '2', name: '根据自己的想法作出决策' }
            ]
          },
          {
            value: null,
            num: '六',
            list: [
              { label: '1', name: '首先是：相信我自己的感觉' },
              { label: '2', name: '首先是：相信我自己的理智' }
            ]
          },
          {
            value: null,
            num: '七',
            list: [
              { label: '1', name: '接受不了冲突' },
              { label: '2', name: '可以忍受冲突对立' }
            ]
          }
        ],
        characterData2: [
          {
            value: null,
            num: '一',
            list: [
              { label: '1', name: '依靠我自己的内在觉察' },
              { label: '2', name: '依靠我的观察' }
            ]
          },
          {
            value: null,
            num: '二',
            list: [
              { label: '1', name: '更多地考虑“可能会是什么”' },
              { label: '2', name: '更多地考虑“是什么”' }
            ]
          },
          {
            value: null,
            num: '三',
            list: [
              { label: '1', name: '喜欢创造' },
              { label: '2', name: '喜欢常识' }
            ]
          },
          {
            value: null,
            num: '四',
            list: [
              { label: '1', name: '凭灵光一现的洞察力做事' },
              { label: '2', name: '凭仔细分析做事' }
            ]
          },
          {
            value: null,
            num: '五',
            list: [
              { label: '1', name: '喜欢研究概念' },
              { label: '2', name: '喜欢研究事实和数据' }
            ]
          },
          {
            value: null,
            num: '六',
            list: [
              { label: '1', name: '注重全局考虑' },
              { label: '2', name: '注重细节' }
            ]
          },
          {
            value: null,
            num: '七',
            list: [
              { label: '1', name: '喜欢远大的构想' },
              { label: '2', name: '喜欢确定的事实' }
            ]
          }
        ]
      }
      this.isReset = false
      this.characterShow = true
    },
    async getResult () {
      try {
        const result = await this.$Api.army.job.getCognitionDetail({})
        if (result.code === 2000) {
          this.submitResult = result.result
          this.isReset = true
          this.characterShow = false
        } else if (result.code === 5210) { // 未做过职业性格测试
          this.isReset = false
          this.characterShow = true
        }
      } catch (e) {
        console.warn(e)
      }
    },
    async goResult () {
      this.isResult = true
      const data1 = this.characterObj.characterData1
      const data2 = this.characterObj.characterData2
      // 情感
      this.result.emotional = this.getScore(data1)
      // 逻辑
      this.result.logic = data1.length - this.result.emotional
      // 直觉
      this.result.intuition = this.getScore(data2)
      // 感觉
      this.result.feeling = data2.length - this.result.intuition
      try {
        const result = await this.$Api.army.job.getCognitionDetail({
          emotionNum: this.result.emotional,
          logicNum: this.result.logic,
          intuitionNum: this.result.intuition,
          feelNum: this.result.feeling
        })
        if (result.code === 2000) {
          window.scrollTo(0, 0)
          this.isResult = false
          this.characterShow = false
          this.submitResult = result.result
        } else {
          this.isResult = false
        }
      } catch (e) {
        console.warn(e)
      }
    },
    getScore (arr) {
      let num = 0
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === '1') {
          num++
        }
      }
      return num
    },
    getStatus (newVal) {
      for (let i = 0; i < newVal.length; i++) {
        if (newVal[i].value === null) {
          return false
        }
      }
      return true
    }
  }
}
</script>

<style type="text/css" lang="sass" scoped>
.van-radio
  margin: 5px 0
::v-deep .van-radio__label
  font-size: 12px
.character
  padding: 10px 0 20px
  position: absolute
  overflow: auto
  z-index: 1
  left: 0
  right: 0
  top: 0
  bottom: 0
  .character-content
    background: #fff
    margin: 0 auto
    padding: 10px 0 20px 0
    .character-bread
      padding: 0 24px
      margin-bottom: 60px
    .character-title
      padding: 0 24px
      text-align: center
      font-weight: bold
      font-size: 16px
    .character-message
      text-align: center
      font-size: 14px
      margin: 20px 0
      color: #333
    .character-body
      font-size: 14px
      .character-body-item
        .character-body-title
          padding: 10px 16px
          h2
            color: #000
            font-size: 14px
          p
            color: #666
            font-size: 12px
            margin-top: 4px
        .the-title-list
          .the-title-item
            position: relative
            padding: 10px 16px
            &:before
              content: " "
              display: block
              height: 1px
              position: absolute
              background: #ebedf0
              left: 16px
              right: 16px
              top: 0
              transform: scaleY(0.5)
            .the-title-rank
              margin-right: 60px
              font-size: 12px
              padding-bottom: 5px
            .el-radio
              width: 270px
              height: 18px
              line-height: 18px
      .character-body-item:last-child
        margin-top: 30px
    .btn-box
      display: flex
      justify-content: center
      margin-top: 20px
    .character-result
      margin-top: 20px
      .character-result-item
        position: relative
        display: block
        width: 100%
        height: 400px
        .character-result-title
          padding-left: 16px
          font-size: 14px
          color: #000000
          display: flex
          height: 20px
          align-items: center
          margin: 0
        .character-result-title:before
          content: ''
          display: block
          width: 2px
          height: 14px
          background: #409EFF
          margin-right: 4px
          position: relative
          top: 1px
        .character-result-info
          position: absolute
          left: -80px
          top: -50px
          transform: scale(0.65)
          width: 520px
          height: 486px
          background: url("../../../assets/img/job/character.svg") no-repeat center
          background-size: 394px 395px
          position: relative
          box-sizing: border-box
          .character-title-item
            position: absolute
            height: 20px
          .intuition
            right: 0
            top: 0
            left: 0
            text-align: center
          .logic
            right: 0
            top: 0
            bottom: 0
            margin: auto 0
          .feeling
            right: 0
            bottom: 0
            left: 0
            text-align: center
          .emotional
            left: 0
            top: 0
            bottom: 0
            margin: auto 0
          .character-box
            width: 180px
            height: 182px
            overflow: hidden
            position: absolute
            .character-info
              transition: all .4s  ease-in
              background-color: #FFFFFF
              .character-info-item
                width: 180x
                height: 182px
                color: #ffffff
                p
                  span
                    color: #F56C6C
                .character-left-title
                  width: 100%
                  height: 100%
                  display: flex
                  font-size: 17px
                  color: #000
                  flex-wrap: wrap
                  align-items: center
                  .txt-box
                    padding: 0 16px
                    .character-left-txt
                      width: 100%
                    .character-left-txt2
                      margin-bottom: 20px
              .color-contrast
                padding: 0 8px 0 8px
                margin: 0
                color: #000
                display: flex
                align-items: center
            .character-info-other
              .character-info-item:last-child
                margin-top: 2px
          .cultivate
            left: 78px
            top: 57px
            .character-info-item
              background-color: #8BD16A
          .hope
            right: 77px
            top: 57px
            .character-info-item
              background-color: #70B6FF
          .guide
            right: 77px
            bottom: 59px
            .character-info-item
              background-color: #ECB96E
          .harmony
            left: 78px
            bottom: 59px
            .character-info-item
              background-color: #FFFF40
</style>
