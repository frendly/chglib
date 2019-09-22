import $ from "jquery";

const form = () => {
  const input = $('.form-group input');
  input.blur(function() {
    const val = $(this).val();
    if (val.length > 0) {
      $(this).addClass('has-value');
    }
  });

  const form = $('.ajax-form')
  form.on('submit', (e) => {
    e.preventDefault();
  
    $.ajax({
      url: form.attr('action'),
      type: form.attr('method'),
      data: form.serialize(),
      statusCode: {
          0: function() {
              //Success message
          },
          200: function() {
            console.log('//Success Message');
              //Success Message
          }
      }
    });
  });
}

export default form;