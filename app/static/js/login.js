/**
 * Created by longnc on 12/4/15.
 */

$(function(){
    $('.login-form').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {email: 'required', password: 'required'},
        messages: {
            email: {required: 'Email is required.'},
            password: {required: 'Password is required.'}
        },
        highlight: function (element) {$(element).closest('.form-group').addClass('has-error');},
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });






// end function ready =======================================================================
});
