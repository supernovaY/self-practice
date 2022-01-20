module.exports = {
  '/api/menu/query': {
    $post: (params) => {
      console.log(params);
      return {
        errMsg: '调用成功',
        status: 0,
        data: [
          {
            id: 9999,
            menuId: '9999', // 要是字符串，antd Menu组件的 key 值只支持字符串
            menuName: '首页一号',
            path: '/#/index01', // 有子菜单就是空字符串
            engName: 'index-01', // 英文名
            parentNo: null, // 父级菜单 menuId
            subMenu: [],
          },
          {
            id: 9998,
            menuId: '9998',
            menuName: '首页二号',
            path: '/#/index02',
            engName: 'index-02',
            parentNo: null,
            subMenu: [],
          },
          {
            id: 1,
            menuId: '1', // 要是字符串，antd Menu组件的 key 值只支持字符串
            menuName: '人员管理',
            path: '', // 有子菜单就是空字符串
            engName: 'person-manage', // 英文名
            parentNo: null, // 父级菜单 menuId
            subMenu: [
              {
                id: 2,
                menuId: '2',
                menuName: '人员列表',
                engName: 'person-list',
                path: '/#/personManage/personList',
                parentNo: '1',
                subMenu: [],
              },
              {
                id: 3,
                menuId: '3',
                menuName: '人员调动概况',
                engName: 'person-move',
                path: '/#/personManage/personMove',
                parentNo: '1',
                subMenu: [],
              },
            ],
          },
          {
            id: 4,
            menuId: '4',
            menuName: '大数据分析',
            path: '',
            engName: 'big-data',
            parentNo: null,
            subMenu: [
              {
                id: 5,
                menuId: '5',
                menuName: '市场绩效',
                engName: 'market-kpi',
                path: '',
                parentNo: '4',
                subMenu: [
                  {
                    id: 6,
                    menuId: '6',
                    menuName: '返厂退还率',
                    engName: 'market-return-rate',
                    path: '/#/bigData/marketKpi/returnRate',
                    parentNo: '5',
                    subMenu: [],
                  },
                  {
                    id: 7,
                    menuId: '7',
                    menuName: '返厂损失率',
                    engName: 'market-lose-rate',
                    path: '/#/bigData/marketKpi/LoseRate',
                    parentNo: '5',
                    subMenu: [],
                  },
                ],
              },
              {
                id: 8,
                menuId: '8',
                menuName: '考勤记录',
                engName: 'work-record',
                path: '/#/bigData/workRecord',
                parentNo: '4',
                subMenu: [],
              },
            ],
          },
        ],
      };
    },
  },
};
