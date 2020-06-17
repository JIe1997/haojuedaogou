document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    $(".loading").hide();

    $(".people").show();
    $(".title").show();
    $(".logo").show();
    $(".present-left").show();
    $(".present-right").show();
    $(".btn_guide").show();
    $(".btn_rank").show();

    // 动画
    let peopleTimer = setInterval(() => {
      $(".people").removeClass('animate__fadeInUp animate__delay-1s')
      $(".people").addClass('animate__headShake')
      let peopleTimerIn = setInterval(() => {
        $(".people").removeClass('animate__headShake');
        clearInterval(peopleTimerIn);
      }, 1000);
    }, 5000);

    let lightTimer = setInterval(() => {
      if ($('#main').hasClass('pic1')) {
        $('#main').removeClass('pic1').addClass('pic2');
      } else {
        $('#main').removeClass('pic2').addClass('pic1');
      }
    }, 1000);

  }
}

$(function () {
  const lottery = new Lottery('.lottery');
  let res_arr = [200, 300, 500];
  // result 返回的中奖金额
  let result = res_arr[random(res_arr.length)];

  btnClick();

  // 提交
  $("#form_submit").click(function () {
    
    // 可以抽奖
    lottery.canLottery();

    // 不可以抽奖
    // lottery.canNotLottery();

    $('body').removeClass('overflow-hidden');
    $('.enter').removeClass('show');

    // 开始抽奖
    lottery.startLottery(result);
    $(".game_start").find('img').attr('src', 'images/game_stop.png');
    $(".game_start").addClass('stop');

    return false;
  })

  // 点击抽奖
  $('.lottery').on('click', '.game_start', function () {
    // 正在抽奖不能点
    if (lottery.lotteryIng) {
      return false;
    }
    if ($(".game_start").hasClass('stop') && lottery.showIsCanLottery()) {
      // 点击停止抽奖 ()
      $(".game_start").addClass('bg-gray');
      lottery.stopLottery(result, function () {
        $(".game_start").removeClass('stop');
        $(".game_start").find('img').attr('src', 'images/game_start.png');
        lottery.endLiObjAddClass();
        $(".game_start").removeClass('bg-gray');
        
        let showWinningTimer = setTimeout(function () {
          $(".winning").addClass('show');
          lottery.lotteryIng = false;
          lottery.endLiObjRemoveClass();
          clearTimeout(showWinningTimer);
        }, 1500);
      });
      return false;
    }


    if (!lottery.showIsCanLottery()) {
      // 填写资料
      $('body').addClass('overflow-hidden');
      $('.enter').addClass('show');
      lottery.reset();

    }
  })

});

function btnClick() {
  // guide
  $('.btn_guide').click(function () {
    $('body').addClass('overflow-hidden');
    $('.guide').addClass('show');
  })
  $('.guide .btn-close').click(function () {
    $('body').removeClass('overflow-hidden');
    $('.guide').removeClass('show');
  })
  // rank
  $('.btn_rank').click(function () {
    $('body').addClass('overflow-hidden');
    $('.rank').addClass('show');
  })
  $('.rank .btn-close').click(function () {
    $('body').removeClass('overflow-hidden');
    $('.rank').removeClass('show');
  });

  // enter
  $('.enter .btn-close').click(function () {
    $('body').removeClass('overflow-hidden');
    $('.enter').removeClass('show');
  });

  // winning
  $('.winning .back-button').click(function () {
    $('body').removeClass('overflow-hidden');
    $('.winning').removeClass('show');
  });
}