var sel = $('.sel'),
    txt = $('.txt'),
    options = $('.options');

sel.click(function (e) {
    e.stopPropagation();
    options.show();
});

$('body').click(function (e) {
    options.hide();
});

options.children('div').click(function (e) {
    e.stopPropagation();
  
    $(this).addClass('selected').siblings('div').removeClass('selected');
 
});