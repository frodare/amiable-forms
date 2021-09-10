const normalizeEmpty = (v: any): any => {
  if (v === undefined || v === null || (typeof v === 'number' && isNaN(v))) return undefined
  return v
}

export default normalizeEmpty
