Stripe.setPublishableKey('pk_test_p8Vntar9YU6uaiajSDvAqOWP');



var $form = $('#checkout-form');

$form.submit(function (event) {
    if($('#checkout-form input[name=paymentMode]:checked').val()==='cc'){
        $('#charge-error').addClass('hidden');
        $form.find('button').prop('disabled', true);
        Stripe.card.createToken({
            number: $('#card-number').val(),
            cvc: $('#card-cvc').val(),
            exp_month: $('#card-expiry-month').val(),
            exp_year: $('#card-expiry-year').val(),
            name: $('#card-name').val()
        }, stripeResponseHandler);
        return false;
    }else{

        $form.get(0).submit();
    }
    return false;

});

function stripeResponseHandler(status, response) {
    if (response.error) {

        // Show the errors on the form
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false); // Re-enable submission

    } else { // Token was created!

        // Get the token ID:
        var token = response.id;

        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        // Submit the form:
        $form.get(0).submit();

    }
}

$(document).ready(function() {
    $('input[type=radio][name=paymentMode]').change(function() {
        if (this.value === 'cc') {
            $("#creditCardContainer").show();
        }else {
            $("#creditCardContainer").hide();
        }
    });
});



