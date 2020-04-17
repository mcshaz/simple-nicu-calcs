import './request-submit-polyfill';
if (!HTMLFormElement.prototype.reportValidity) {
    HTMLFormElement.prototype.reportValidity = function() {
        if (this.checkValidity()){
            return true;
        }
        if (this.noValidate){
            this.noValidate = false;
            this.requestSubmit();
            this.noValidate = true;
        } else {
            this.requestSubmit();
        }
        return false;
    };
}