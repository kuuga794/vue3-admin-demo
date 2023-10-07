type TypePageData = {
  pageNum: number;
  pageSize: number;
}

type TypeListQuery = {
  startTime?: string | null
  endTime?: string | null
  time?: string[] | null
  pageNum: number
  pageSize: number
}

type TypeResponse = {
  code: number
  msg: string | null
  [key: string]: any
}

type TypeOptions = {
  label: string;
  value: number | string;
}[];