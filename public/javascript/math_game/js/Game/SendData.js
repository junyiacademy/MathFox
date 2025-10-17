import Phaser from 'phaser';
import { setBtnEnable, delay } from '../Game/utils'
import { config } from '../GameConfig';
import SendData from './images/SendData';
import { saveCompletedStage } from '../User/ProgressStorage';

export default class extends Phaser.State {
  init(stage) {
    this.StageList = stage;
    console.log(this.StageList);
  }
  preload() {
    this.load.atlasJSONArray('SendData', SendData, '', require('../../assets/SendData/SendData.json'));
  }
  create() {
    this.SendText = this.add.sprite(0, 0, 'SendData', 'Sending.png');
    this.Success = this.add.sprite(config.centerX, config.centerY, 'SendData', 'Success.png');
    this.Success.scale.setTo(0);
    this.Success.anchor.setTo(0.5);
    this.SuccessBtn = createHoverArea(this, 860, 430);
    this.SuccessBtn.events.onInputDown.add(this.exit, this);
    this.Fail = this.add.sprite(config.centerX, config.centerY, 'SendData', 'Fail.png');
    this.Fail.scale.setTo(0);
    this.Fail.anchor.setTo(0.5);
    this.FailBtn = createHoverArea(this, 860, 430);
    this.FailBtn.events.onInputDown.add(this.exit, this);
    this.Login = this.add.sprite(config.centerX, config.centerY, 'SendData', 'Login.png');
    this.Login.scale.setTo(0);
    this.Login.anchor.setTo(0.5);
    this.LoginBtn = createHoverArea(this, 860, 430);
    this.LoginBtn.events.onInputDown.add(this.exit, this);
    SendStageState(this.StageList, this.success.bind(this), this.error.bind(this), this.CheckLogin.bind(this));
  }
  success(data) {
    this.SendText.alpha = 0;
    if (data.success === true) this.ShowSuccessBoard();
    else this.ShowFailBoard();
  }
  error(jqXHR, Status, errorThrown) {
    console.log(jqXHR, Status, errorThrown);
    this.SendText.alpha = 0;
    this.ShowFailBoard();
  }
  ShowSuccessBoard() {
    tweenScale(this, this.Success, 1)
      .onComplete.add(() => setBtnEnable(this.SuccessBtn, true));
  }
  ShowFailBoard() {
    tweenScale(this, this.Fail, 1)
      .onComplete.add(() => setBtnEnable(this.FailBtn, true));
  }
  CheckLogin() {
    this.SendText.alpha = 0;
    tweenScale(this, this.Login, 1)
      .onComplete.add(() => setBtnEnable(this.LoginBtn, true));
  }
  async exit() {
    tweenScale(this, this.Success, 0);
    tweenScale(this, this.Fail, 0);
    tweenScale(this, this.Login, 0);
    await delay(300);
    this.state.start('GameBoot', true, true, 'LevelMap');
  }
}

const tweenScale = (game, obj, scale) => game.add.tween(obj.scale).to({ x: scale, y: scale }, 300, 'Quad.easeOut', true, 0);

const SendStageState = (stageList, callback1, callback2, callback3) => {
  // Save completed stage to localStorage
  const latestStage = stageList[stageList.length - 1];

  try {
    const success = saveCompletedStage(latestStage);

    if (success) {
      // Simulate async behavior like the original API
      setTimeout(() => {
        callback1({ success: true, message: 'Progress saved to localStorage' });
      }, 300);
    } else {
      setTimeout(() => {
        callback2(null, 'error', 'Failed to save progress');
      }, 300);
    }
  } catch (error) {
    console.error('Error saving progress:', error);
    setTimeout(() => {
      callback2(null, 'error', error.message);
    }, 300);
  }
}

const createHoverArea = (game, x, y) => {
  let hover = game.add.graphics();
  hover.beginFill(0xffffff);
  hover.drawRect(x, y, 100, 60);
  hover.alpha = 0;
  return hover;
}
