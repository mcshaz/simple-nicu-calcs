if (!HTMLFormElement.prototype.requestSubmit) {
    HTMLFormElement.prototype.requestSubmit = function() {
        const submitBtn = document.createElement('input');
        submitBtn.type = 'submit';
        submitBtn.hidden = true;
        this.appendChild(submitBtn);
        submitBtn.click();
        this.removeChild(submitBtn);
    };
}