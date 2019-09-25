import $ from "jquery";

const form = () => {
  const input = $('.form-group input');
  input.blur(function() {
    const val = $(this).val();
    if (val.length > 0) {
      $(this).addClass('has-value');
    }
  });

  const form = $('.ajax-form');

  form.on('submit', function(e) {
    e.preventDefault();

    const isValid = form[0].checkValidity();

    if(isValid) {
      form.find('.ajax-form__done').css('display', 'flex');
    }
  
    $.ajax({
      url: form.attr('action'),
      type: form.attr('method'),
      data: form.serialize(),
      success: function(data) { //Success Message
        console.log('//Success Message');
      }
    });
  });
}

export default form;