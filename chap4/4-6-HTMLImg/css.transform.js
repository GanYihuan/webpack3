module.exports = function (css) {
  console.log(css)
  console.log(window.innerWidth)
  if (window.innerWidth >= 768) {
    return css.replace('#f00', '#0f0')
  } else {
    return css.replace('#f00', '#00f')
  }
}