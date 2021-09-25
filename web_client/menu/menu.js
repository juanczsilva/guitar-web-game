// console.log(getFoo());
// eslint-disable-next-line no-unused-vars
function menuTest(e) {
  const event = e || window.event;
  const target = event.target || event.srcElement;
  console.log(target.value);
}
