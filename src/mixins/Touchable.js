function Touchable() {}
Touchable.prototype = {
    touchStart: function(event) {
        event.preventDefault();
    },
    touchEnd: function(event) {
        event.preventDefault();
        if(this.click) {
            this.click();
        }
    }
};

export default Touchable;
