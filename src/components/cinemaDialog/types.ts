export interface Cinema {
  id: number
  shortName: string
  officialName: string
  address: string
  areaCode: string
  areaName: string
  boxLevelCode: string
  boxLevelName: string
  chainControlStatus: number
  chainId: number
  chainName: string
  cityId: 138
  cityName: string
  cityGradeCode: string
  code: string
  controlStatus: number
  countyId: number
  countyName: string
  createTime: number
  createUser: number
  gradeCode: string
  hallCount: number
  halls: any[]
  hasHall: true
  pricingLevelCode: string
  pricingLevelName: string
  provinceId: number
  provinceName: string
  seatCount: number
  softwareCode: string
  softwareName: string
  status: number
  zipCode: string
}

export interface AddToListEvent {
  list: Cinema[]
}
