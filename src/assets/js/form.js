import $ from "jquery";

const form = () => {
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