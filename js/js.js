$(function () {
  let lottery = new Lottery('.lottery');

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

  // 提交
  $("#form_submit").click(function(){

    // 可以抽奖
    lottery.canLottery();

    // 不可以抽奖
    // lottery.canNotLottery();

    $('body').removeClass('overflow-hidden');
    $('.enter').removeClass('show');
    return false;
  })

  // 点击抽奖
  $('.lottery').on('click','.game_start',function(){
    if($(".game_start").hasClass('stop') && lottery.showIsCanLottery()){
      
      lottery.stopLottery(300,function(){
        $(".game_start").removeClass('stop');
      });
      
      return false;
    }
    if(lottery.showIsCanLottery()){
      // 开始抽奖
      lottery.startLottery(300);
      $(".game_start").addClass('stop');
    }else{
      // 填写资料
      $('body').addClass('overflow-hidden');
      $('.enter').addClass('show');
    }
  })

});

const dataLottery = [
  [500,200,300,200,'game_start',200,300,200,300],
  [200,500,300,200,'game_start',200,300,200,300],
  [200,300,500,200,'game_start',200,300,200,300],
  [200,300,200,500,'game_start',200,300,200,300],
  [200,300,200,200,'game_start',500,300,200,300],
  [200,300,200,200,'game_start',300,500,200,300],
  [200,300,200,200,'game_start',300,200,500,300],
  [200,300,200,200,'game_start',300,200,300,500]
];

function Lottery(className){
  this.El = document.querySelector(className);
  this.moveData = [0,1,2,5,8,7,6,3];
  this.dataLength = dataLottery.length;
  this.isCanLottery = false;
  this.isReadyLottery = false;
  this.startSpeed = 100;
  this.stopSpeed = 100;
  this.lotteryData = [];
  this.lotteryIndex = 0;
  this.startTimer = null;
  this.endTimer = null;
  this.isStartTimer = false;
  this.isStopTimer = false;
  this.stopMoveIndex = 0;
  this.init();
}

Lottery.prototype = {
  init: function(){
    this.createElement();
  },
  createElement: function(){
    const n = random(this.dataLength);
    this.lotteryData = [...dataLottery[n]];
    let html = '';
    this.lotteryData.forEach((el,i)=>{
      if(typeof el === 'number'){
        html += `<li><img src="images/yuan_${el}.png" alt=""></li>`
      }else{
        html += `<li class="game_start"><img src="images/${el}.png" alt=""></li>`
      }
    });
    this.El.innerHTML = html;
  },
  reset: function(){
    this.El.innerHTML = '';
    this.canNotLottery();
    this.createElement();
  },
  showIsCanLottery: function(){
    return this.isCanLottery;
  },
  canLottery: function(){
    this.isCanLottery = true;
  },
  canNotLottery: function(){
    this.isCanLottery = false;
  },
  startLottery: function(result){
    if(typeof result === 'undefined'){
      alert('页面数据错误,请刷新页面,重新录入销售')
    }
    let self = this;
    const lis = [...self.El.querySelectorAll('li')];
    
    startLottery();
    function startLottery(){  
      if(self.isStartTimer) return;  
      Move();  
      setTimeout(startLottery,self.startSpeed); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒  
    }
    function Move(){
      if(self.lotteryIndex>=self.moveData.length){
        self.lotteryIndex = 0;
      }
      let lotteryIndex = self.moveData[self.lotteryIndex];
      lis.forEach((li,index)=>{
        if(lotteryIndex === index){
          li.classList.add('on');
        }else{
          li.classList.remove('on');
        }
      })
      self.lotteryIndex+=1;
    }
  },
  stopLottery: function(result,callback){
    let self = this;

    self.isStartTimer = true;
    self.isReadyLottery = false;

    const lis = [...self.El.querySelectorAll('li')];
    // 停下来的位置
    const stopIndex = self.lotteryIndex-1;
    // 停下来li的位置
    self.stopMoveIndex = self.moveData[self.lotteryIndex-1];
    // console.log(stopIndex)
    const stopData = self.lotteryData[self.moveData[stopIndex]];
    
    lis[self.stopMoveIndex].classList.remove('on');
    console.log(self.stopMoveIndex)
    // 500的位置
    const fiveIndex = self.lotteryData.findIndex(item=>item==500);
    // 算还要走几格
    let needStep = 0;

    let newData = []
    self.moveData.forEach(item=>{
      newData.push(self.lotteryData[item]);
    })
    self.moveData.forEach(item=>{
      newData.push(self.lotteryData[item]);
    })

    if(parseInt(result) === 200 ){
      needStep = calcNum(200);
    }else if(parseInt(result) === 300){
      needStep = calcNum(300);
    } else if(parseInt(result) === 500) {

    }

    stopLottery();

    function calcNum(num){
      if(stopData === num){
        return 8;
      }else{
        return newData.indexOf(result,stopIndex) - stopIndex + 8;
      }
    }
    
    function stopLottery(){  
      if(self.isStopTimer) return;  
      Move(callback);  
      setTimeout(stopLottery,self.stopSpeed); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒  
    }
    
    function Move(callback){
      if(needStep===0){
        clearInterval(self.stopTimer);
        callback && callback();
      }else{
        
        console.log("stopMoveIndex ",self.stopMoveIndex)
        self.stopSpeed += 100;
        let lotteryIndex = self.moveData[Math.abs(self.stopMoveIndex)];
        console.log("lotteryIndex",lotteryIndex)
        lis.forEach((li,index)=>{
          if(lotteryIndex === index){
            li.classList.add('on');
          }else{
            li.classList.remove('on');
          }
        })

        needStep-=1;
        self.stopMoveIndex -= 1;
      }
    }
    
  }
}

function random(n){
  return Math.floor(Math.random()*Math.floor(n));
}