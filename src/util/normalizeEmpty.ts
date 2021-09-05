const normalizeEmpty = (v: any): any => {
  if (v === undefined || v === null || isNaN(v)) return undefined
  return v
}

export default normalizeEmpty
