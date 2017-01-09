const pad = n => n < 10 ? ('0'+n) : n

Array(1).fill().map((_, i) =>
  require(`./ex${pad(i)}.test.js`))