var app = angular.module('CRUD',[]);
app.service('localStorageService', function() {
  var self = this;

  self.getProperty = function(propertyName) {
    var result = localStorage.getItem(propertyName);
    result = result || "[]";
    return angular.fromJson(result);
  };

  self.setProperty = function(propertyName, value) {
    localStorage.setItem(propertyName, angular.toJson(value));
  };
});
app.controller('RoleController', ['localStorageService', function(localStorageService) {
  var self = this;
  var propertyName = "RoleList";
  self.isList = true;
  self.dataList = localStorageService.getProperty(propertyName);
  self.editData = {};
  //新增
  self.goNew = function(init) {
    self.isList = false;
    self.editData = {};
    init();
  };
  //編輯
  self.goEdit = function(item, init) {
    self.isList = false;
    self.editData = angular.copy(item);
    init(item.ability);
  };
  //刪除
  self.delete = function(item) {
    self.dataList.splice(self.dataList.indexOf(item), 1);
    localStorageService.setProperty(propertyName, self.dataList);
  };
  //確認
  self.submit = function(ability) {
    //複製編輯的物件
    var copy = angular.copy(self.editData);
    //將調整的能力值加入
    copy.ability = ability;
    //判斷是否有ID值，有ID值代表是修改的，新增時ID為空
    if (copy.id) {
      angular.forEach(self.dataList, function(value, key) {
        if (value.id === copy.id)
          self.dataList[key] = copy;
      });
    } else {
      //新增時加入新的ID值
      var now = new Date();
      copy.id = (now).getTime();
      copy.createdTime = now;
      self.dataList.push(copy);
    }
    self.isList = true;
    self.editData = {};
    //將結果寫入LocalStorage
    localStorageService.setProperty(propertyName, self.dataList);
  };
  //返回
  self.backList = function() {
    self.isList = true;
    self.editData = {};
  };
  //確認是否可以儲存
  self.checkForm = function(checkAbilitySet) {
    if (!self.editData.name)
      return false;

    return checkAbilitySet();
  };
}]);
app.controller('AbilityController', [function() {
  var self = this;
  var maxAbility = 50;
  self.ability = {
    strength: 0,
    vitality: 0,
    agility: 0,
    wisdom: 0
  };
  //預設角色
  self.init = function(value) {
    value = value || {};
    self.maxAbility = maxAbility;
    self.ability = {
      strength: value.strength || 0,
      vitality: value.vitality || 0,
      agility: value.agility || 0,
      wisdom: value.wisdom || 0
    };
    self.maxAbility -= self.ability.strength;
    self.maxAbility -= self.ability.vitality;
    self.maxAbility -= self.ability.agility;
    self.maxAbility -= self.ability.wisdom;
  };
  //增加能力
  self.plus = function(propertyName) {
    if(self.maxAbility > 0) {
      self.ability[propertyName]++;
      self.maxAbility--;
    }
  };
  //減少能力
  self.minus = function(propertyName) {
    if(self.ability[propertyName] > 0) {
      self.ability[propertyName]--;
      self.maxAbility++;
    }
  };
  //確認能力都有點滿
  self.checkAbilitySet = function() {
    if (self.maxAbility > 0)
      return false;

    return true;
  };
}]);