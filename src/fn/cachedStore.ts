type GetValCallback = () => any

export default function() {
  const cache: any = {}
  return (key: string, getVal: GetValCallback) => {
    return key in cache
      ? cache[key]
      : (cache[key] = getVal())
  }
}
