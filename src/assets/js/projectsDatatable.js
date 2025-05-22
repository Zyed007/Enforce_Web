$('.continue').click(function(){
    console.log('next');
    $('.nav-tabs > .active').next('li').find('a').trigger('click');
  });
  $('.back').click(function(){
    console.log('prev');

    $('.nav-tabs > .active').prev('li').find('a').trigger('click');
  });