const Validator = {
  Require: /.+/,
  Email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  Phone: /^((\(\d{2,3}\))|(\d{3}-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(-\d{1,4})?$/,
  Mobile: /^1\d{10}$/,
  Url: /^((https|http)?:\/\/)[^\s]+/,
  IdCard: 'this.IsIdCard(value)',
  Currency: /^\d+(\.\d+)?$/,
  Number: /^\d+$/,
  Zip: /^[1-9]\d{5}$/,
  QQ: /^[1-9]\d{4,16}$/,
  Integer: /^[-+]?\d+$/,
  Double: /^[-+]?\d+(\.\d+)?$/,
  English: /^[A-Za-z]+$/,
  Chinese: /^[\u0391-\uFFE5]+$/,
  Username: /^\w\w{5,16}$/i,
  // 营业执照
  CompanyCode: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/,
  // 台湾护照
  TailandCard: /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/,
  // 港澳通行证
  HKCard: /^[CW]\d{8}$/,
  // 护照
  Foreigner: /^1[45][0-9]{7}$|([P|p|S|s]\d{7}$)|([S|s|G|g]\d{8}$)|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|([H|h|M|m]\d{8,10})$/,
  UnSafe: /^(([A-Z]*|[a-z]*|\d*|[-_~!@#$%^&*.()[]{}<>?\/'"]*)|.{0,7})$|\s/,
  // 账号登录安全密码
  PassWord1: /^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{6,20}$/,
  IsSafe: function (str) {
    return !this.UnSafe.test(str)
  },
  SafeString: 'this.IsSafe(value)',
  Filter: "this.DoFilter(value, getAttribute('accept'))",
  Limit: "this.limit(value.length,getAttribute('min'),  getAttribute('max'))",
  LimitB:
    "this.limit(this.LenB(value), getAttribute('min'), getAttribute('max'))",
  Date: "this.IsDate(value, getAttribute('min'), getAttribute('format'))",
  Repeat: "value == document.getElementsByName(getAttribute('to'))[0].value",
  Range: "getAttribute('min') < (value|0) && (value|0) < getAttribute('max')",
  Compare: "this.compare(value,getAttribute('operator'),getAttribute('to'))",
  Custom: "this.Exec(value, getAttribute('regexp'))",
  Group:
    "this.MustChecked(getAttribute('name'), getAttribute('min'), getAttribute('max'))",
  ErrorItem: [document.forms[0]],
  ErrorMessage: ['以下原因导致提交失败：\t\t\t\t'],
  limit: function (len, min, max) {
    min = min || 0
    max = max || Number.MAX_VALUE
    return min <= len && len <= max
  },
  LenB: function (str) {
    return str.split('').length
  },
  AddError: function (index, str) {
    this.ErrorItem[this.ErrorItem.length] = this.ErrorItem[0].elements[index]
    this.ErrorMessage[this.ErrorMessage.length] = str
  },
  Exec: function (op, reg) {
    return new RegExp(reg, 'g').test(op)
  },
  compare: function (op1, operator, op2) {
    switch (operator) {
      case 'NotEqual':
        return op1 !== op2
      case 'GreaterThan':
        return op1 > op2
      case 'GreaterThanEqual':
        return op1 >= op2
      case 'LessThan':
        return op1 < op2
      case 'LessThanEqual':
        return op1 <= op2
      default:
        return op1 === op2
    }
  },
  MustChecked: function (name, min, max) {
    var groups = document.getElementsByName(name)
    var hasChecked = 0
    min = min || 1
    max = max || groups.length
    for (var i = groups.length - 1; i >= 0; i--) { if (groups[i].checked) hasChecked++ }
    return min <= hasChecked && hasChecked <= max
  },
  DoFilter: function (input, filter) {
    return new RegExp(
      '^.+.(?=EXT)(EXT)$'.replace(/EXT/g, filter.split(/\s*,\s*/).join('|')),
      'gi'
    ).test(input)
  },
  IsIdCard: function (number) {
    number = number.toLowerCase()
    var date, Ai
    var verify = '10x98765432'
    var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    var area = [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '北京',
      '天津',
      '河北',
      '山西',
      '内蒙古',
      '',
      '',
      '',
      '',
      '',
      '辽宁',
      '吉林',
      '黑龙江',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '上海',
      '江苏',
      '浙江',
      '安微',
      '福建',
      '江西',
      '山东',
      '',
      '',
      '',
      '河南',
      '湖北',
      '湖南',
      '广东',
      '广西',
      '海南',
      '',
      '',
      '',
      '重庆',
      '四川',
      '贵州',
      '云南',
      '西藏',
      '',
      '',
      '',
      '',
      '',
      '',
      '陕西',
      '甘肃',
      '青海',
      '宁夏',
      '新疆',
      '',
      '',
      '',
      '',
      '',
      '台湾',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '香港',
      '澳门',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '国外'
    ]
    var re = number.match(
      /^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/i
    )
    if (re == null) return false
    if (re[1] >= area.length || area[re[1]] === '') return false
    if (re[2].length === 12) {
      Ai = number.substr(0, 17)
      date = [re[9], re[10], re[11]].join('-')
    } else {
      Ai = number.substr(0, 6) + '19' + number.substr(6)
      date = ['19' + re[4], re[5], re[6]].join('-')
    }
    // console.log(this.IsDate(date, 'ymd'))
    if (!this.IsDate(date, 'ymd')) return false
    var sum = 0
    for (var i = 0; i <= 16; i++) {
      sum += Ai.charAt(i) * Wi[i]
    }
    Ai += verify.charAt(sum % 11)
    return number.length === 15 || (number.length === 18 && number === Ai)
  },
  IsDate: function (op, formatString) {
    formatString = formatString || 'ymd'
    var m, year, month, day
    switch (formatString) {
      case 'ymd':
        m = op.match(
          new RegExp('^((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})$')
        )
        if (m == null) return false
        day = m[6]
        month = m[5] * 1
        year = m[2].length === 4 ? m[2] : GetFullYear(parseInt(m[3], 10))
        break
      case 'dmy':
        m = op.match(
          new RegExp('^(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))$')
        )
        if (m == null) return false
        day = m[1]
        month = m[3] * 1
        year = m[5].length === 4 ? m[5] : GetFullYear(parseInt(m[6], 10))
        break
      default:
        break
    }
    if (!parseInt(month)) return false
    month = month === 0 ? 12 : month
    var date = new Date(year, month - 1, day)
    return (
      typeof date === 'object' &&
      parseInt(year) === date.getFullYear() &&
      parseInt(month) === date.getMonth() + 1 &&
      parseInt(day) === date.getDate()
    )
    function GetFullYear (y) {
      return ((y < 30 ? '20' : '19') + y) | 0
    }
  }
}

export default Validator
