import Common from '../common.js'
import API from '../api.js'

async function updateArmyInfo (callback) {
  const $vue = Common.getVue()

  // 当前老兵信息
  const ArmyInfo = $vue.$store.state.localData.armyInfo
  const userId = $vue.$store.state.localData.Userinfo.id
  const updateData = {}

  // 老兵是否存在列表内
  let armyInList = false

  let change = false

  // || oldUserInfo.id !== logininfo.result.id

  // 我的老兵代持数据
  const armyListData = await API.army.user.getMyArmyList({
    userId: userId
  })

  console.log(armyListData)

  if (armyListData.code === 2000) {
    updateData.armyList = armyListData.result || []

    // 检测老兵是否在列表内
    armyListData.result.map((item) => {
      if (ArmyInfo.id === item.id) {
        armyInList = true
      }
    })

    if (!armyInList) {
      // 优先选择我自己的老兵
      armyListData.result.map((item) => {
        if (item.type === 0) {
          change = true
          updateData.armyInfo = item
        }
      })

      // 用户不是老兵 但是有代持数据 默认使用代持
      if (!change) {
        if (armyListData.result.length > 0) {
          for (let i = 0; i < armyListData.result.length; i++) {
            updateData.armyInfo = armyListData.result[i]
          }
        } else {
          // 当用户不是老兵 且没有代持数据 则 重置到默认
          updateData.armyInfo = {
            id: '',
            userName: '',
            type: 0
          }
        }
      }
    }

    $vue.$store.commit('updateLocalData', updateData)
  }

  if (callback && armyListData.code === 2000) {
    callback()
  }
}

export default updateArmyInfo
