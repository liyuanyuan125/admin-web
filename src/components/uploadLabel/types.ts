export interface FileItem {
  /** 文件（图片）地址 */
  url: string
  /** 文件ID */
  fileId: string
  /** 客户端文件名 */
  clientName: string
  /** 客户端文件大小 */
  clientSize: number
  /** 客户端文件类型 */
  clientType: string
}

export interface DoneEvent {
  item: FileItem
  file: File
}
