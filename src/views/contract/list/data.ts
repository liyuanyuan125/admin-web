import { get, post, put } from '@/fn/ajax'
import {
  dot,
  formatIntDateRange,
  formatTimestamp,
  fillByKeyText,
} from '@/util/dealData'
import { KeyText } from '@/util/types'
import { slice } from '@/fn/object'

/**
 * 查询合同列表
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/34/interface/api/5233
 */
export async function queryList(query: any = {}) {
  const { data } = await get('/customer/contracts', query)

  const result = {
    ...data,

    items: ((data.items as any[]) || []).map(it => ({
      ...it,
      validityDate: formatIntDateRange(it.validityStartDate, it.validityEndDate),
      createTimeText: formatTimestamp(it.createTime),
    })),

    hasSettlementPriceList: [{ key: 1, text: '有' }, { key: 2, text: '无' }]
  }

  return result
}

const filterAttachment = (item: any) => {
  const result = {
    ...item,
    uploadTimeText: formatTimestamp(item.uploadTime)
  }
  return result
}

/**
 * 查询合同详情
 * https://yapi.aiads-dev.com/project/34/interface/api/5212
 * https://yapi.aiads-dev.com/project/34/interface/api/5226
 * @param query 查询条件
 */
export async function queryItem(query: any = {}) {
  const { id } = query
  const url = `/customer/contracts/${id > 0 ? id : 'view'}`
  const { data } = await get(url)

  const {
    cityGradeList = []
  } = data

  const {
    validityStartDate = 0,
    validityEndDate = 0
  } = data.item || {}

  const item = data.item || {}

  // 审核状态：0 未知，1 待审核，2 通过，3 拒绝，4 作废
  const status = parseInt(item.approveStatus, 10) || 0

  const filterCinema = (it: any) => {
    return fillByKeyText(it, {
      cityGradeCode: cityGradeList
    })
  }

  const result = {
    ...data,
    item: {
      ...item,
      validityDate: [
        validityStartDate,
        validityEndDate
      ],
      settlementPrice: {},
      accountBank: '',
      accountName: '',
      accountNumber: '',
      cinemaList: (item.details || []).map(filterCinema),
      attachmentList: (item.attachments || []).map(filterAttachment),

      // 审核是否通过，默认通过
      auditPass: status != 3 && status != 4,

      // 是否被审核过（通过或拒绝）
      audited: status == 2 || status == 3 || status == 4,
    },
    filterCinema,
  }

  return result
}

// 按照接口要求，处理数据
const dealEditItem = (item: any) => {
  const data = {
    // 合同主体信息
    contractName: item.contractName,
    companyACode: item.companyACode,
    contractNo: item.contractNo,
    validityStartDate: item.validityDate[0] || 0,
    validityEndDate: item.validityDate[1] || 0,

    // 乙方信息
    companyBId: item.companyBId,
    companyBContact: item.companyBContact,
    companyBPhone: item.companyBPhone,
    provideQuery: item.provideQuery,
    freeVideo: item.freeVideo,
    resourceTimeLimit: item.resourceTimeLimit,
    resourceTimeSection: item.resourceTimeSection,

    // 普通广告片结算规则
    settlementType: item.settlementType,
    details: (item.cinemaList as any[]).map(it => slice(it,
      'cinemaId,commonPrice,trailerPrice,accountBank,accountName,accountNumber')),
    provideInvoice: item.provideInvoice,
    invoiceType: item.invoiceType,
    invoiceContent: item.invoiceContent,

    // 附件信息
    attachments: (item.attachmentList as any[]).map(it => slice(it, 'name,fileId')),

    // 责任人
    signingUser: item.signingUser,
    followUser: item.followUser,

    // 备注
    remark: item.remark,
  }

  return data
}

/**
 * 新建合同
 * https://yapi.aiads-dev.com/project/34/interface/api/5170
 * @param item 数据
 */
export async function newItem(item: any) {
  const pdata = dealEditItem(item)
  const { data } = await post('/customer/contracts', pdata)
  return data
}

/**
 * 修改合同
 * https://yapi.aiads-dev.com/project/34/interface/api/5268
 * @param item 数据
 */
export async function editItem(item: any) {
  const pdata = dealEditItem(item)
  const { data } = await put(`/customer/contracts/${item.id}`, pdata)
  return data
}

/**
 * 复制合同
 * @param item 数据
 */
export async function copyItem(item: any) {
  delete item.id
  return newItem(item)
}

/**
 * 审核平台账号
 * https://yapi.aiads-dev.com/project/34/interface/api/5240
 * @param id 账号ID
 * @param pdata 数据
 */
export async function auditItem(id: number, pdata: any) {
  const { data } = await put(`/customer/contracts/${id}/status`, pdata)
  return data
}
