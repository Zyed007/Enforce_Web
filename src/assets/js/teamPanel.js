// $(document).ready(function() {
//     $('.category>.nav-tabs > li > a').click(function(event){
//     //stop browser to take action for clicked anchor
                
//     //get displaying tab content jQuery selector
//     var active_tab_selector = $('.category>.nav-tabs > li > a').attr('href');					
                
//     //find actived navigation and remove 'active' css
//     var actived_nav = $('.category>.nav-tabs > .nav-item>.nav-link.active');
//     actived_nav.removeClass('active');
                
//     //add 'active' css into clicked navigation
//     $(this).addClass('active');
              
//     //hide displaying tab content
//     $(active_tab_selector).removeClass('active');
//     $(active_tab_selector).addClass('hide');
                
//     //show target tab content
//     var target_tab_selector = $(this).attr('href');
//     $(target_tab_selector).removeClass('hide');
//     $(target_tab_selector).addClass('active');
//      });

 
//   });



$(document).ready(function(){$(".category>.nav-tabs > li > a").click(function(a){var e=$(".category>.nav-tabs > li > a").attr("href");$(".category>.nav-tabs > .nav-item>.nav-link.active").removeClass("active"),$(this).addClass("active"),$(e).removeClass("active"),$(e).addClass("hide");var t=$(this).attr("href");$(t).removeClass("hide"),$(t).addClass("active")})});