const dataLottery = [
  [500, 200, 300, 200, 'game_start', 200, 300, 200, 300],
  [200, 500, 300, 200, 'game_start', 200, 300, 200, 300],
  [200, 300, 500, 200, 'game_start', 200, 300, 200, 300],
  [200, 300, 200, 500, 'game_start', 200, 300, 200, 300],
  [200, 300, 200, 200, 'game_start', 500, 300, 200, 300],
  [200, 300, 200, 200, 'game_start', 300, 500, 200, 300],
  [200, 300, 200, 200, 'game_start', 300, 200, 500, 300],
  [200, 300, 200, 200, 'game_start', 300, 200, 300, 500]
];

const audioObj = audioInit();

function Lottery(className) {
  this.El = document.querySelector(className);
  this.moveData = [0, 1, 2, 5, 8, 7, 6, 3];
  this.dataLength = dataLottery.length;
  this.isCanLottery = false;
  this.isReadyLottery = false;
  this.startSpeed = 120;
  this.stopSpeed = 200;
  this.lotteryData = [];
  this.lotteryIndex = 0;
  this.isStartTimer = false;
  this.isStopTimer = false;
  this.endLiObj = null;
  this.init();
}

Lottery.prototype = {
  init: function () {
    this.createElement();
  },
  createElement: function () {
    const n = random(this.dataLength);
    this.lotteryData = [...dataLottery[n]];
    let html = '';
    this.lotteryData.forEach((el, i) => {
      if (typeof el === 'number') {
        html += `<li><img src="images/yuan_${el}.png" alt=""></li>`
      } else {
        html += `<li class="game_start"><img src="images/${el}.png" alt=""></li>`
      }
    });
    this.El.innerHTML = html;
  },
  reset: function () {
    this.El.innerHTML = '';
    this.lotteryIndex = 0;
    this.isCanLottery = false;
    this.isReadyLottery = false;
    this.isStartTimer = false;
    this.isStopTimer = false;
    this.startSpeed = 100;
    this.stopSpeed = 200;
    this.endLiObjRemoveClass();
    this.endLiObj = null; // 抽中的那个li对象
    this.lotteryIng = false; // 是否正在抽奖
    this.canNotLottery();
    this.createElement();
  },
  showIsCanLottery: function () {
    return this.isCanLottery;
  },
  canLottery: function () {
    this.isCanLottery = true;
  },
  canNotLottery: function () {
    this.isCanLottery = false;
  },
  startLottery: function (result) {
    if (typeof result === 'undefined') {
      alert('页面数据错误,请刷新页面,重新录入销售');
    }
    let self = this;
    const lis = [...self.El.querySelectorAll('li')];

    startLottery();
    function startLottery() {
      if (self.isStartTimer) return;
      Move();
      setTimeout(startLottery, self.startSpeed); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒  
    }
    function Move() {
      if (self.lotteryIndex >= self.moveData.length) {
        self.lotteryIndex = 0;
      }
      let lotteryIndex = self.moveData[self.lotteryIndex];
      lis.forEach((li, index) => {
        if (lotteryIndex === index) {
          li.classList.add('on');
          audioObj.ding_arr[index].play();
          // audioObj.sound_win.pause();
        } else {
          li.classList.remove('on');
        }
      })
      self.lotteryIndex += 1;
    }
  },
  stopLottery: function (result, callback) {
    let self = this;

    self.lotteryIng = true;
    self.isStartTimer = true;
    self.isReadyLottery = false;

    const lis = [...self.El.querySelectorAll('li')];
    // 停下来的位置
    let stopIndex = self.lotteryIndex - 1;
    // 停下来li的位置
    let stopMoveIndex = self.moveData[self.lotteryIndex - 1];
    // console.log(stopIndex)
    let stopData = self.lotteryData[self.moveData[stopIndex]];

    lis[stopMoveIndex].classList.remove('on');

    // 500的位置
    const fiveIndex = self.lotteryData.findIndex(item => item == 500);
    let fiveMoveIndex = self.moveData.findIndex(item => item === fiveIndex);
    console.log(stopIndex, fiveMoveIndex)
    // 算还要走几格
    let needStep = 0;

    // [200,300,...]
    let newData = [];
    for (let i = 0; i < 2; i++) {
      self.moveData.forEach(item => {
        newData.push(self.lotteryData[item]);
      })
    }
    // [0,1,2,5,...]
    let newMoveData = [
      ...self.moveData,
      ...self.moveData,
      ...self.moveData,
      ...self.moveData
    ];

    if (parseInt(result) === 200) {
      needStep = calcNum(200);
    } else if (parseInt(result) === 300) {
      needStep = calcNum(300);
    } else if (parseInt(result) === 500) {
      needStep = calcNum(500);
    }

    stopLottery();

    function calcNum(num) {
      let circle = 16;
      if(num === 500) circle = 8;
      if (stopData === num) {
        return circle;
      } else {
        return newData.indexOf(result, stopIndex) - stopIndex + circle;
      }
    }

    function stopLottery() {
      if (self.isStopTimer) return;
      Move(callback);
      setTimeout(stopLottery, self.stopSpeed); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒  
    }

    function Move(callback) {

      if (needStep <= 0) {
        self.isStopTimer = true;
        self.canNotLottery();
        audioObj.ding_arr.forEach(ding=>{
          ding.pause();
        })
        audioObj.sound_win.play();
        callback && callback();
      } else {
        needStep -= 1;
        stopIndex += 1;
        self.stopSpeed += 50;
        let lotteryIndex = newMoveData[stopIndex];
        lis.forEach((li, index) => {
          if (lotteryIndex === index) {
            li.classList.add('on');
            audioObj.ding_arr[index].play();
            // audioObj.sound_win.pause();
            self.endLiObj = li;
          } else {
            li.classList.remove('on');
          }
        })

      }
    }

  },
  endLiObjAddClass: function () {
    if (this.endLiObj !== null) {
      this.endLiObj.classList.add('active')
    }
  },
  endLiObjRemoveClass: function () {
    if (this.endLiObj !== null) {
      this.endLiObj.classList.remove('on')
      this.endLiObj.classList.remove('active')
    }
  },
}

function random(n) {
  return Math.floor(Math.random() * Math.floor(n));
}

function audioInit(){
  let ding_arr = [];
  let sound_win = null;
  dataLottery[0].forEach((el,i)=>{
    ding_arr[i] = new Howl({
      src: ['music/ding.mp3']
    }); 
  })
  sound_win = new Howl({
    src: ['music/sound_win.mp3']
  }); 
  return {
    ding_arr:ding_arr,
    sound_win:sound_win
  }
}