// Mock global variables for standalone deployment
// Note: These need to support both direct access and ES6 default imports
var globalUserObj = {
  id: 'demo-user',
  name: 'Demo User',
  nickname: 'Demo User',
  email: 'demo@example.com',
  level: 1
};
globalUserObj.default = globalUserObj;
window.globalUser = globalUserObj;

var AnalyticsObj = {
  sendEvent: function() {
    console.log('Analytics.sendEvent:', arguments);
  },
  send_ga_event: function() {
    console.log('Analytics.send_ga_event:', arguments);
  }
};
AnalyticsObj.default = AnalyticsObj;
window.Analytics = AnalyticsObj;

var getPassedStageIDListFunc = function() {
  return [];
};
getPassedStageIDListFunc.default = getPassedStageIDListFunc;
window.getPassedStageIDList = getPassedStageIDListFunc;

window.path_prefix = '';
