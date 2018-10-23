module.exports.isHexadecimal = value => {
  return (typeof value === 'string') && /^[0-9A-F]+$/i.test(value)
}
