module.exports = text =>
  text
    .replace(/(\s*)/g, '')
    .replace(/[？?。!！：:；;]|·{1,6}|\.{1,6}/g, match => `${match}\n`)
    .split('\n')
    .filter(v => v);
