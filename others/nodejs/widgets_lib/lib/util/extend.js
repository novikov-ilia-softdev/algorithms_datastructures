module.exports = extend;

function extend(Child, Parent) {
    Child.prototype = new Parent();
    Child.super = Parent.prototype;
}
