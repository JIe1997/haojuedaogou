$(function () {
  let isCanLottery = false;

  $('.btn_guide').click(function () {
    $('body').addClass('overflow-hidden');
    $('.guide').addClass('show');
  })
  $('.guide .btn-close').click(function () {
    $('body').removeClass('overflow-hidden');
    $('.guide').removeClass('show');
  })
  $('.btn_rank').click(function () {
    $('body').addClass('overflow-hidden');
    $('.rank').addClass('show');
  })
  $('.rank .btn-close').click(function () {
    $('body').removeClass('overflow-hidden');
    $('.rank').removeClass('show');
  });

  $('.enter .btn-close').click(function () {
    $('body').removeClass('overflow-hidden');
    $('.enter').removeClass('show');
  });

  $('.winning .btn-close').click(function () {
    $('body').removeClass('overflow-hidden');
    $('.winning').removeClass('show');
  });

})