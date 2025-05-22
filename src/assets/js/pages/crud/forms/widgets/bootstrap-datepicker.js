// Class definition

var KTBootstrapDatepicker = function () {
     $('#ntpDate').html(moment().format('ddd, D MMM YYYY'));
    //  $('#dueDate').html(moment().format('ddd, D MMM YYYY'));
    var arrows;
    if (KTUtil.isRTL()) {
        arrows = {
            leftArrow: '<i class="la la-angle-right"></i>',
            rightArrow: '<i class="la la-angle-left"></i>'
        }
    } else {
        arrows = {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    }
    
    // Private functions
    var demos = function () {
        // minimum setup
        $('#kt_datepicker_1, #kt_datepicker_1_validate').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows
        });

        // minimum setup for modal demo
        $('#kt_datepicker_1_modal').datepicker({
            rtl: KTUtil.isRTL(),
            opens:  KTUtil.isRTL(),
            format: 'dddd/mm/yyyy',
            // defaultDate: moment(),
            autoclose: !0,
            todayHighlight: true,
            orientation: "top right",
      
           templates: arrows,
           "closeOnSelected": true,
        }).on('changeDate', function (ev) {
            console.log('date')
            var input =ev.format();
            // var parts = input.split("/");
            // var d1 = new Date(Number(parts[2]), Number(parts[1])-1 , Number(parts[0]));
            let date=document.getElementById('dueDate').innerText
            console.log('init',date);
             $('#dueDate').html(ev.format('D, d M yyyy'));
    
            
        });;

        // input group layout 
        // $('.date-picker').datepicker({
        //     rtl: KTUtil.isRTL(),
        //     todayHighlight: true,
        //     // orientation: "bottom right",
        //     templates: arrows,
           
        // });

        $(".date-picker").datepicker({

            opens:  KTUtil.isRTL(),
            todayHighlight: true,
            format: 'dddd/mm/yyyy',
            // defaultDate: moment(),
            autoclose: !0,
            templates: arrows,
            endDate: "today",
            maxDate: new Date(),
            "closeOnSelected": true,
        }).on('changeDate', function (ev) {
            console.log('date')
            var input =ev.format();
            // var parts = input.split("/");
            // var d1 = new Date(Number(parts[2]), Number(parts[1])-1 , Number(parts[0]));

             $('#ntpDate').html(ev.format('D, d M yyyy'));
    
            
        });
;

        $('#selectDate').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom right",
            templates: arrows
        });

        // input group layout for modal demo
        $('#kt_datepicker_2_modal').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows
        });

        // enable clear button 
        $('#kt_datepicker_3, #kt_datepicker_3_validate').datepicker({
            rtl: KTUtil.isRTL(),
            todayBtn: "linked",
            clearBtn: true,
            todayHighlight: true,
            templates: arrows
        });

        // enable clear button for modal demo
        $('#kt_datepicker_3_modal').datepicker({
            rtl: KTUtil.isRTL(),
            todayBtn: "linked",
            clearBtn: true,
            todayHighlight: true,
            templates: arrows
        });

        // orientation 
        $('#kt_datepicker_4_1').datepicker({
            rtl: KTUtil.isRTL(),
            orientation: "top left",
            todayHighlight: true,
            templates: arrows
        });

        $('#kt_datepicker_4_2').datepicker({
            rtl: KTUtil.isRTL(),
            orientation: "top right",
            todayHighlight: true,
            templates: arrows
        });

        $('#kt_datepicker_4_3').datepicker({
            rtl: KTUtil.isRTL(),
            orientation: "bottom left",
            todayHighlight: true,
            templates: arrows
        });

        $('#kt_datepicker_4_4').datepicker({
            rtl: KTUtil.isRTL(),
            orientation: "bottom right",
            todayHighlight: true,
            templates: arrows
        });

        // range picker
        $('#kt_datepicker_5').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            templates: arrows
        });

         // inline picker
        $('#kt_datepicker_6').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            templates: arrows
        });
    }

    return {
        // public functions
        init: function() {
            demos(); 
        }
    };
}();

jQuery(document).ready(function() {    
    KTBootstrapDatepicker.init();
   
}); 