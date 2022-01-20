import request from './request.js'
import Common from './common.js'
// import aliossUpload from './aliossupload.js'

function buildgetquery (param) {
  return Common.KhttpBuildQuery(param)
}

// 默认get 如果未设置 method: 'post'
export default {
  // 通用接口
  common: {
    /**
     * 埋点数据统计请求
     */
    visitCounter (param) {
      return request({
        url: 'CAppPointLog/savePoint',
        data: param,
        method: 'post'
      })
    },

    /**
     * 获取系统版本号
     */
    getversion () {
      return request({
        url: 'common/version'
      })
    },

    /**
     * 获取城市数据
     */
    getCityData () {
      return request({
        url: ''
      })
    },

    /**
     * 保存搜索记录
     */
    saveSearchHistory (keyword, usePosition) {
      return request({
        url: 'search/saveKeyWord',
        data: {
          keyword: keyword,
          usePosition: usePosition
        },
        method: 'post'
      })
    },

    /**
     * 获取搜索记录
     */
    getSearchHistory (usePosition) {
      return request({
        url: 'search/listUserKeyword' + buildgetquery({
          usePosition: usePosition
        })
      })
    },

    /**
     * 获取阿里云OSS上传配置
     */
    getUploadTicket () {
      return request({
        url: 'common/upload/config'
      })
    },

    /**
     * 上传图片
     */
    uploadimg (file) {
      const formdata = new FormData()
      formdata.append('file', file)

      return request({
        url: 'common/upload',
        data: formdata,
        method: 'post'
      })
    },

    /**
     * 上传base64图片
     */
    uploadBase64Image (base64data) {
      // const file = Common.dataURLtoFile(base64data, 'uploadimg')
      // const formdata = new FormData()

      // formdata.append('file', base64data)

      // return aliossUpload.uploadBase64(base64data)
      return request({
        url: 'common/upload',
        data: { file: base64data },
        method: 'post'
      })
    },

    /**
     * 获取字典表数据(第一个选项为‘请选择’)
     * @param {String} keyword 关键词
     */
    category (keyword) {
      return request({
        url: 'ModuleDict/listByDictCode' + buildgetquery({
          dictCode: keyword
        })
      })
    },

    /**
     * 获取字典表数据(无‘请选择’)
     * @param {String} keyword 关键词
     */
    categoryNoHead (keyword) {
      return request({
        url: 'ModuleDict/listByDictCodeNoHead' + buildgetquery({
          dictCode: keyword
        })
      })
    },

    /**
     * 用户登录
     * @param {String} ticket 登录授权令牌
     */
    login (param) {
      return request({
        url: 'sys/login' + buildgetquery(param)
      })
    },

    /**
     * @param {Object} param
     * 检测码引擎code 是否可用过期
     */
    checkQrcode (param) {
      return request({
        url: 'sys/scanCode',
        data: param,
        method: 'post'
      })
    },

    // 字典表类型数据
    categoryData: {
      /**
       * 获取行业选项数据
       */
      categoryJob (parentId) {
        return request({
          url: 'job/cStation/treeDataCStation',
          data: {
            parentId: parentId || 0
          },
          method: 'post'
        })
      },

      /**
       * 获取行业选项数据
       */
      categoryIndustry () {
        return request({
          url: 'ModuleDict/treeDataByDictCode',
          data: {
            dictCode: 'INDUSTRY'
          },
          method: 'post'
        })
      }
    }
  },

  // 支付相关
  pay: {
    /**
     * 线下支付订单
     */
    payOfflineOrder (param) {
      return request({
        url: 'TOrder/payOrder',
        data: param,
        method: 'post'
      })
    },

    /**
     * 查询我的待支付订单
     */
    checkMyWaitPayOrder () {
      return request({
        url: 'TOrder/needPayOrder',
        method: 'post'
      })
    }
  },

  // 消息相关
  message: {
    /**
     * 设置消息已读状态
     */
    setReaded (id) {
      return request({
        url: 'message/readMessage',
        data: { id: id },
        method: 'post'
      })
    },

    /**
     * 删除消息
     */
    delItem (param) {
      return request({
        url: 'message/removeMessage',
        data: param,
        method: 'post'
      })
    },

    /**
     * 获取消息列表
     */
    getList (param) {
      return request({
        url: 'message/paginate',
        data: param,
        method: 'post'
      })
    },

    /**
     * 获取我的未读消息数量
     */
    unreadCount (userId) {
      return request({
        url: 'message/countUnread' + buildgetquery({ userId: userId })
      })
    }
  },

  // 意见反馈
  suggestion: {
    /**
     * @param {Object} id
     * 获取意见反馈回复信息
     */
    getResponseDetail (id) {
      return request({
        url: 'common/queryFeedback' + buildgetquery({ id: id })
      })
    },

    /**
     * @param {Object} content
     * 添加意见反馈
     */
    add (content) {
      // const formdata = new FormData()
      // formdata.append('content', content)

      return request({
        url: 'common/addFeedback',
        data: { content: content },
        method: 'post'
      })
    }
  },

  // 用户信息
  userinfo: {
    /**
     * @param {Object} param
     * 获取代持人信息
     */
    getLoginUserInfo (id) {
      return request({
        url: 'sys/getApplyUserInfo' + buildgetquery({
          userId: id
        })
      })
    },

    /**
     * 获取用户信息
     */
    getPersonalInfo (param) {
      return request({
        url: 'sys/getSoldierInfo' + buildgetquery(param)
      })
    },

    /**
     * 查询用户商家/机构 身份信息
     */
    checkMyMerchantService () {
      return request({
        url: 'sys/merchant/login',
        method: 'post'
      })
    },

    /**
     * 获取真实姓名
     */
    getRealName () {
      return request({
        url: 'sys/getUserName'
      })
    },

    /**
     * 更新头像
     */
    updateAvatar (param) {
      return request({
        url: 'sys/updateAvatar',
        data: param,
        method: 'post'
      })
    }
  },

  // 退伍军人
  army: {
    /**
     * @param {Object} param
     * 生成老兵码
     */
    createArmyQrcode (param) {
      return request({
        url: 'sys/getQRCode' + buildgetquery(param)
      })
    },

    /**
     * @param {Object} orderid
     * 获取订单可使用的优惠券信息
     */
    getPayOrderCouponList (orderid) {
      // const formdata = new FormData()
      // formdata.append('orderId', orderid)

      return request({
        url: 'TOrder/useCouponList' + Common.KhttpBuildQuery({
          orderId: orderid
        })
      })
    },

    /**
     * @param {Object} id
     * 查询已使用的优惠券信息
     */
    getUsedCouponDetai (id) {
      return request({
        url: 'treatment/coupon/verificationDetail' + buildgetquery({ id: id })
      })
    },

    /**
     * @param {Object} param
     * 获取当前我的优惠券列表
     */
    getCouponList (param) {
      return request({
        url: 'treatment/listUserCoupon',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} param
     * 获取商家/机构列表
     */
    getMerchantServiceList (param) {
      return request({
        url: 'treatment/paginate',
        data: param,
        method: 'post'
      })
    },

    // 军人端 访问商家信息相关
    merchant: {
      /**
       * @param {Object} param
       * 获取用户在该商家可用优惠券
       */
      getMerchantCoupon (param) {
        return request({
          url: 'treatment/listMerchantCoupon',
          data: param,
          method: 'post'
        })
      },

      /**
       * @param {Object} id
       * 获取支付订单详情
       */
      getMerchantOrderDetail (id) {
        return request({
          url: 'treatment/getOrderDetail' + buildgetquery({ orderId: id })
        })
      },

      /**
       * @param {Object} param
       * 获取订单列表
       */
      getMerchantOrderList (param) {
        return request({
          url: 'treatment/paginateUserOrderRecord',
          data: param,
          method: 'post'
        })
      },

      /**
       * @param {Object} id
       * 获取商家详情
       */
      getMerchantInfo (id) {
        return request({
          url: 'treatment/getMerchantDetail' + buildgetquery({ id: id })
        })
      }
    },

    // 军人端 访问机构相关信息
    service: {
      /**
       * @param {Object} param
       * 获取服务订单列表
       */
      getServiceOrder (param) {
        return request({
          url: 'treatment/paginateUserServiceRecord',
          data: param,
          method: 'post'
        })
      },

      /**
       * @param {Object} id
       * 获取机构详情
       */
      getServiceInfo (id) {
        return request({
          url: 'treatment/getServiceDetail' + buildgetquery({ id: id })
        })
      }
    },

    /**
     * @param {Object} param
     * 获取军人优惠券列表
     */
    getCoupons (param) {
      return request({
        url: 'treatment/listUserCoupon',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} id
     * 获取一张优惠券信息
     */
    getCoupon (id) {
      return request({
        url: 'sys/coupon/detail' + buildgetquery({ couponId: id })
      })
    },

    /**
     * 排序我的应用
     */
    sortMyApplication (param) {
      return request({
        url: 'app/sortApp',
        data: param,
        method: 'post'
      })
    },

    /**
     * 获取我的应用
     */
    getMyApplication (param) {
      return request({
        url: 'app/listApplication',
        data: param,
        method: 'post'
      })
    },

    /**
     * 获取适应性培训列表
     */
    getApplicabilityTraining () {
      return request({
        url: 'applicability/training/listTraining'
      })
    },

    /**
     * 获取适应性培训详情
     */
    getApplicabilityTrainingDetail (id) {
      return request({
        url: 'applicability/training/getDetail' + buildgetquery({ trainingId: id })
      })
    },

    // 申请代持
    incharge: {
      /**
       * @param {Object} phone
       * 修改代持人手机号
       */
      editPhone (param) {
        return request({
          url: 'sys/updateAppliedPhone',
          data: param,
          method: 'post'
        })
      },

      /**
       * @param {Object} id
       * 查询申请代持结果进度
       */
      getProcessInfo (id) {
        return request({
          url: 'chargeApply/getDetail' + buildgetquery({ id: id })
        })
      },

      /**
       * @param {Object} param
       * 提交代持申请
       */
      apply (param) {
        return request({
          url: 'chargeApply/save',
          data: param,
          method: 'post'
        })
      }
    },

    // 政策 政策解读文章
    policy: {
      /**
       * 获取文章列表
       * @param {Object} param
       */
      getList (param) {
        return request({
          url: 'policy/search',
          data: param,
          method: 'post'
        })
      },

      /**
       * 获取文章详情
       */
      getDetail (id) {
        return request({
          url: 'policy/getDetail' + buildgetquery({ id: id })
        })
      },

      /**
       * 更文章详情浏览量
       */
      updateViewCount (param) {
        return request({
          url: 'common/updateViewNumber',
          data: param,
          method: 'post'
        })
      }
    },

    // 用户信息相关
    user: {
      /**
       * 获取用户信息 和 军人信息
       * @param {Object} param
       */
      getInfo () {

      },

      /**
       * 获取我的老兵数据列表
       */
      getMyArmyList (param) {
        return request({
          url: 'sys/listSharedSoldier' + buildgetquery(param)
        })
      },

      // 生成老兵码
      createQrcode (param) {
        return request({
          url: 'sys/getQRCode' + buildgetquery(param)
        })
      }
    },

    // 码上创业相关
    startup: {
      // 获取军创园列表
      getArmyParkList (param) {
        return request({
          url: 'startup/armypark/paginateForFront',
          data: param,
          method: 'post'
        })
      },
      // 获取军创园详情
      getArmyParkDetail (id) {
        return request({
          url: 'startup/armypark/detail' + buildgetquery({ id: id })
        })
      },
      // 获取创业意向列表
      getStartupIntentionList (id) {
        return request({
          url: 'startup/intention/list' + buildgetquery({ soldierId: id })
        })
      },
      // 获取创业意向详情
      getStartupIntentionDetail (id) {
        return request({
          url: 'startup/intention/detail' + buildgetquery({ id: id })
        })
      },
      // 删除创业意向
      removeStartupIntention (id) {
        return request({
          url: 'startup/intention/remove',
          data: [id],
          method: 'post'
        })
      },
      // 保存创业意向
      saveSartupIntention (param) {
        return request({
          url: 'startup/intention/saveOrUpdate',
          data: param,
          method: 'post'
        })
      },
      // 检查是否允许新增创业意向
      isIntentionAbove (id) {
        return request({
          url: 'startup/intention/isAbove' + buildgetquery({ soldierId: id })
        })
      },
      // 获取创业扶持列表
      getArmySupportList (param) {
        return request({
          url: 'startup/armySupport/paginateForFront',
          data: param,
          method: 'post'
        })
      },
      // 获取创业扶持详情
      getArmySupportDetail (id) {
        return request({
          url: 'startup/armySupport/detail' + buildgetquery({ id: id })
        })
      },
      // 获取创业培训列表
      getStartupTrainingList (param) {
        return request({
          url: 'startup/training/paginateForFront',
          data: param,
          method: 'post'
        })
      },
      // 获取创业培训详情
      getStartupTrainingDetail (id) {
        return request({
          url: 'startup/training/detail' + buildgetquery({ id: id })
        })
      },
      // 获取业务办理菜单数据
      getStartupOnlineHandle (param) {
        return request({
          url: 'startup/onlineHandle/paginateForFront' + buildgetquery(param)
        })
      }
    },

    // 码上就业
    job: {
      /**
       * 获取就业首页推荐位banner
       */
      getJobBanner () {
        return request({
          url: 'job/employmentStation/listFeatures'
        })
      },
      /**
       * @param {Object} param
       * 获取招聘岗位列表
       */
      getJobStationList (param) {
        return request({
          url: 'job/employmentStation/paginateForFront',
          data: param,
          method: 'post'
        })
      },
      // 获取招聘岗位详情
      getJobStationDetail (id) {
        return request({
          url: 'job/employmentStation/detail' + buildgetquery({ id: id })
        })
      },
      // 申请招聘岗位
      applyJobStation (id) {
        return request({
          url: 'job/employmentStation/changeApply' + buildgetquery({ id: id })
        })
      },
      // 判断简历是否完善
      isResumeCompleted () {
        return request({
          url: 'job/employmentStation/isInfoCompleted'
        })
      },
      // 收藏/取消收藏招聘岗位
      collectJobStation (id) {
        return request({
          url: 'job/employmentStation/changeCollect' + buildgetquery({ id: id })
        })
      },
      /**
       * @param {Object} param
       * 保存更新 简历信息
       */
      saveResumeAndWorkExperience (param) {
        return request({
          url: 'job/employmenArmyInfo/saveOrUpdateArmyInfoAndWorkExperience',
          data: param,
          method: 'post'
        })
      },

      /**
       * @param {Object} id
       * 删除求职意向
       */
      delJobIntention (id) {
        return request({
          url: 'job/employmentIntention/deleteById' + buildgetquery({ id: id })
        })
      },

      /**
       * @param {Object} param
       * 添加/编辑 求职意向
       */
      addEditJobIntention (param) {
        return request({
          url: 'job/employmentIntention/saveOrUpdate',
          data: param,
          method: 'post'
        })
      },

      /**
       * @param {Object} id
       * 获取户意向岗位详细信息
       */
      getIntentionDetail (id) {
        return request({
          url: 'job/employmentIntention/detail' + buildgetquery({ id: id })
        })
      },

      /**
       * @param {Object} soldierId
       * 获取简历基础信息 和 工作经历列表
       */
      getResumeAndExpirence (soldierId) {
        return request({
          url: 'job/employmenArmyInfo/detailArmyInfoAndWorkExperience' + buildgetquery({ soldierId: soldierId })
        })
      },

      /**
       * @param {Object} id
       * 获取军人意向岗位类型
       */
      jobIntention (id) {
        return request({
          url: 'job/employmentIntention/listIntentionStation' + buildgetquery({ soldierId: id })
        })
      },

      /**
       * @param {Object} param
       * 获取就业指导列表
       */
      getJobGuidanceList (param) {
        return request({
          url: 'job/employmentGuide/paginateForFront',
          data: param,
          method: 'post'
        })
      },

      /**
       * @param {Object} param
       * 获取职业性格测试
       */
      getCognitionDetail (param) {
        return request({
          url: 'selfCognition/getDetail',
          data: param,
          method: 'post'
        })
      },
      /**
       * @param {Object} id
       * 获取就业指导详情
       */
      getJobGuidanceDetail (id) {
        return request({
          url: 'job/employmentGuide/get' + buildgetquery({ id: id })
        })
      },

      /**
       * @param {Object} param
       * 获取教育培训列表
       */
      getJobTrainingList (param) {
        return request({
          url: 'training/organization/list',
          data: param,
          method: 'post'
        })
      },

      /**
       * @param id
       * 获取教育培训详情
       */
      getJobTrainingDetail (id) {
        return request({
          url: 'training/organization/getDetail' + buildgetquery({ organizationId: id })
        })
      },

      // 获取社会培训数据
      getSocialTraining (param) {
        return request({
          url: 'job/employmentBusinessTrainLink/paginateForFront' + buildgetquery(param)
        })
      },

      /**
       * @param {Object} soldierId
       * 获取我的军人求职意向
       */
      getJobPrefer (soldierId) {
        return request({
          url: 'job/employmentIntention/listAllIntentionStation' + buildgetquery({ soldierId: soldierId })
        })
      },
      /**
       * @param {Object} param
       * 获取获取招聘会列表
       */
      getJobFairList (param) {
        return request({
          url: 'job/employmentJobFair/paginateForFront',
          data: param,
          method: 'post'
        })
      },
      /**
       * @param id
       * 获取招聘会详情
       */
      getJobFairDetail (id) {
        return request({
          url: 'job/employmentJobFair/detail' + buildgetquery({ id: id })
        })
      },
      /**
       * @param id
       * 获取公司详情
       */
      getEnterpriseDetail (id) {
        return request({
          url: 'employmentEnterprise/getEnterpriseDetail' + buildgetquery({ enterpriseId: id })
        })
      },
      /**
       * @param id
       * 获取公司招聘岗位列表
       */
      listEnterpriseStation (id) {
        return request({
          url: 'job/employmentStation/listEnterpriseStation' + buildgetquery({ enterpriseId: id })
        })
      },
      /**
       * @param {Object} param
       * 获取我的足迹列表
       */
      getFootPrints (param) {
        return request({
          url: 'job/employmentStation/listFootPrints',
          data: param,
          method: 'post'
        })
      }
    },
    /**
     * @param {Object} param
     * 获取某一类型的应用列表
     */
    getAppMarketList (param) {
      return request({
        url: 'service/listService' + buildgetquery(param)
      })
    }
  },

  // 商户
  merchant: {
    /**
     * 查询我收款成功的订单
     */
    getPaySuccessTimer () {
      return request({
        url: 'TOrder/paySuccessOrder',
        method: 'post'
      })
    },

    /**
     * @param {Object} param
     * 退款订单
     */
    refundOrder (param) {
      return request({
        url: 'TOrder/refundOrder',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} param
     * 创建支付 收款订单
     */
    createPayOrder (param) {
      return request({
        url: 'TOrder/createOrder',
        data: param,
        method: 'post'
      })
    },

    /**
     * 获取优惠券核销统计数据
     */
    getCouponCountData (param) {
      return request({
        url: 'TMerchant/countCouponByMerchantId',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} id
     * 获取优惠券核销详情
     */
    getCouponOrderDetail (id) {
      return request({
        url: 'TMerchant/couponDetail' + buildgetquery({ id: id })
      })
    },

    /**
     * @param {Object} param
     * 获取优惠券核销列表
     */
    getCouponOrderList (param) {
      return request({
        url: 'TMerchant/findCouponList',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} id
     * 获取收款订单详情
     */
    getOrderDetail (id) {
      return request({
        url: 'TMerchant/orderDetail' + buildgetquery({ id: id })
      })
    },

    /**
     * @param {Object} param
     * 获取商家收款记录
     */
    getOrderList (param) {
      return request({
        url: 'TMerchant/findOrder',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} param
     * 修改商家信息
     */
    updateMerchantInfo (param) {
      return request({
        url: 'TMerchant/updateMerchant',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} id
     * 获取商家详情信息
     */
    getMerchantInfo (id) {
      return request({
        url: 'TMerchant/merchantDetail' + buildgetquery({ id: id })
      })
    },

    /**
     * @param {Object} param
     * 获取支付订单列表
     */
    getPayOrderList (param) {
      return request({
        url: 'merchant/orderList',
        data: param,
        method: 'post'
      })
    },

    // 获取统计
    getCountData (param) {
      return request({
        url: 'TMerchant/countOrder',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} param
     * 删除子账号
     */
    delSubAccount (param) {
      return request({
        url: 'TMerchant/deleteRelUser' + buildgetquery(param)
      })
    },

    /**
     * @param {Object} param
     * 添加子账号
     */
    addSubAccount (param) {
      return request({
        url: 'TMerchant/addRelUser',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} param
     * 获取子账号列表
     */
    getSubAccount (param) {
      return request({
        url: 'TMerchant/userList',
        data: param,
        method: 'post'
      })
    }
  },

  // 服务机构
  service: {
    /**
     * @param {Object} param
     * 删除子账号
     */
    delSubAccount (param) {
      return request({
        url: 'TServiceOrganization/deleteRelUser' + buildgetquery(param)
      })
    },

    /**
     * @param {Object} param
     * 添加子账号
     */
    addSubAccount (param) {
      return request({
        url: 'TServiceOrganization/addRelUser',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} param
     * 获取子账号列表
     */
    getSubAccount (param) {
      return request({
        url: 'TServiceOrganization/userList',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} param
     * 编辑机构信息
     */
    updateServiceInfo (param) {
      return request({
        url: 'TServiceOrganization/updateServiceOrganization',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} id
     * 获取服务机构详情信息
     */
    getServiceInfo (id) {
      return request({
        url: 'TServiceOrganization/serviceOrgDetail' + buildgetquery({ id: id })
      })
    },

    /**
     * @param {Object} param
     * 创建服务记录
     */
    createServiceOrder (param) {
      return request({
        url: 'TServiceOrganization/createServiceLog' + buildgetquery(param)
      })
    },

    /**
     * @param {Object} param
     * 查询服务总数据
     */
    getCountData (param) {
      return request({
        url: 'TServiceOrganization/countLog',
        data: param,
        method: 'post'
      })
    },

    /**
     * @param {Object} param
     * 查询服务列表
     */
    getOrderList (param) {
      return request({
        url: 'TServiceOrganization/findLogList',
        data: param,
        method: 'post'
      })
    }
  },

  // 码上追思
  mourn: {
    /**
     * @param {Object} param
     * 获取烈士列表
     */
    listMartyrs (param) {
      return request({
        url: 'mourn/listMartyrs',
        data: param,
        method: 'post'
      })
    },
    /**
     * @param {Object} id
     * 获取烈士详情
     */
    martyrDetail (id) {
      return request({
        url: 'mourn/martyrDetail' + buildgetquery({ id: id })
      })
    },
    /**
     * @param {Object} param
     * 纪念扫祭
     */
    sacrifice (param) {
      return request({
        url: 'mourn/sacrifice',
        data: param,
        method: 'post'
      })
    },
    /**
     * @param {Object} param
     * 提交感言寄语
     */
    sendWord (param) {
      return request({
        url: 'mourn/words/sendWord',
        data: param,
        method: 'post'
      })
    },
    /**
     * @param {Object} param
     * 获取寄语列表
     */
    listWords (param) {
      return request({
        url: 'mourn/words/listWords',
        data: param,
        method: 'post'
      })
    },
    /**
     * @param {Object} param
     * 获取纪念设施列表
     */
    listRemembrances (param) {
      return request({
        url: 'mourn/remembrance/listRemembrances',
        data: param,
        method: 'post'
      })
    },
    /**
     * @param {Object} id
     * 获取烈士详情
     */
    getRemembranceDetail (id) {
      return request({
        url: 'mourn/remembrance/getRemembranceDetail' + buildgetquery({ id: id })
      })
    }
  }
}
