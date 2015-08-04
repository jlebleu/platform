// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

var AppDispatcher = require('../dispatcher/app_dispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var client = require('../utils/client.jsx');

var Constants = require('../utils/constants.jsx');
var ActionTypes = Constants.ActionTypes;
var BrowserStore = require('./browser_store.jsx');

var CHANGE_EVENT = 'change';
var CHANGE_EVENT_SESSIONS = 'change_sessions';
var CHANGE_EVENT_AUDITS = 'change_audits';
var CHANGE_EVENT_TEAMS = 'change_teams';
var CHANGE_EVENT_STATUSES = 'change_statuses';
var CHANGE_EVENT_PHONE_STATUSES = 'change_phone_statuses';

var UserStore = assign({}, EventEmitter.prototype, {

    _current_id: null,

  emitChange: function(userId) {
    this.emit(CHANGE_EVENT, userId);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  emitSessionsChange: function() {
    this.emit(CHANGE_EVENT_SESSIONS);
  },
  addSessionsChangeListener: function(callback) {
    this.on(CHANGE_EVENT_SESSIONS, callback);
  },
  removeSessionsChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT_SESSIONS, callback);
  },
  emitAuditsChange: function() {
    this.emit(CHANGE_EVENT_AUDITS);
  },
  addAuditsChangeListener: function(callback) {
    this.on(CHANGE_EVENT_AUDITS, callback);
  },
  removeAuditsChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT_AUDITS, callback);
  },
  emitTeamsChange: function() {
    this.emit(CHANGE_EVENT_TEAMS);
  },
  addTeamsChangeListener: function(callback) {
    this.on(CHANGE_EVENT_TEAMS, callback);
  },
  removeTeamsChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT_TEAMS, callback);
  },
  emitStatusesChange: function() {
    this.emit(CHANGE_EVENT_STATUSES);
  },
  addStatusesChangeListener: function(callback) {
    this.on(CHANGE_EVENT_STATUSES, callback);
  },
  removeStatusesChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT_STATUSES, callback);
  },
  emitPhoneStatusesChange: function() {
	console.log('----------- emitPhoneStatusesChange');
	this.emit(CHANGE_EVENT_PHONE_STATUSES);
  },
  addPhoneStatusesChangeListener: function(callback) {
	    this.on(CHANGE_EVENT_PHONE_STATUSES, callback);
   },
  removePhoneStatusesChangeListener: function(callback) {
	    this.removeListener(CHANGE_EVENT_PHONE_STATUSES, callback);
  },
  setCurrentId: function(id) {
     this._current_id = id;
     if (id == null) {
         BrowserStore.removeGlobalItem("current_user_id");
     } else {
         BrowserStore.setGlobalItem("current_user_id", id);
     }
  },
  getCurrentId: function(skipFetch) {
    var current_id = this._current_id;

    if (current_id == null) {
        current_id = BrowserStore.getGlobalItem("current_user_id");
    }

    // this is a speical case to force fetch the
    // current user if it's missing
    // it's synchronous to block rendering
    if (current_id == null && !skipFetch) {
      var me = client.getMeSynchronous();
      if (me != null) {
        this.setCurrentUser(me);
        current_id = me.id;
      }
    }

    return current_id;
  },
  getCurrentUser: function(skipFetch) {
    if (this.getCurrentId(skipFetch) == null) {
      return null;
    }

    return this._getProfiles()[this.getCurrentId()];
  },
  setCurrentUser: function(user) {
    this.setCurrentId(user.id);
    this.saveProfile(user);
  },
  getLastEmail: function() {
      return BrowserStore.getItem("last_email", '');
  },
  setLastEmail: function(email) {
    BrowserStore.setItem("last_email", email);
  },
  removeCurrentUser: function() {
    this.setCurrentId(null);
  },
  hasProfile: function(userId) {
    return this._getProfiles()[userId] != null;
  },
  getProfile: function(userId) {
    return this._getProfiles()[userId];
  },
  getProfileByUsername: function(username) {
    return this._getProfilesUsernameMap()[username];
  },
  getProfilesUsernameMap: function() {
    return this._getProfilesUsernameMap();
  },
  getProfiles: function() {

    return this._getProfiles();
  },
  getActiveOnlyProfiles: function() {
    active = {};
    current = this._getProfiles();

    for (var key in current) {
      if (current[key].delete_at == 0) {
        active[key] = current[key];
      }
    }

    return active;
  },
  saveProfile: function(profile) {
    var ps = this._getProfiles();
    ps[profile.id] = profile;
    this._storeProfiles(ps);
  },
  _storeProfiles: function(profiles) {
    BrowserStore.setItem("profiles", profiles);
    var profileUsernameMap = {};
    for (var id in profiles) {
        profileUsernameMap[profiles[id].username] = profiles[id];
    }
    BrowserStore.setItem("profileUsernameMap", profileUsernameMap);
  },
  _getProfiles: function() {
    return BrowserStore.getItem("profiles", {});
  },
  _getProfilesUsernameMap: function() {
    return BrowserStore.getItem("profileUsernameMap", {});
  },
  setSessions: function(sessions) {
    BrowserStore.setItem("sessions", sessions);
  },
  getSessions: function() {
    return BrowserStore.getItem("sessions", {loading: true});
  },
  setAudits: function(audits) {
    BrowserStore.setItem("audits", audits);
  },
  getAudits: function() {
    return BrowserStore.getItem("audits", {loading: true});
  },
  setTeams: function(teams) {
    BrowserStore.setItem("teams", teams);
  },
  getTeams: function() {
    return BrowserStore.getItem("teams", []);
  },
  getCurrentMentionKeys: function() {
    var user = this.getCurrentUser();

    var keys = [];

    if (!user)
        return keys;

    if (user.notify_props && user.notify_props.mention_keys) keys = keys.concat(user.notify_props.mention_keys.split(','));
    if (user.first_name && user.notify_props.first_name === "true") keys.push(user.first_name);
    if (user.notify_props.all === "true") keys.push('@all');
    if (user.notify_props.channel === "true") keys.push('@channel');

    return keys;
  },
  getLastVersion: function() {
    return BrowserStore.getItem("last_version", '');
  },
  setLastVersion: function(version) {
    BrowserStore.setItem("last_version", version);
  },
  setStatuses: function(statuses) {
    this._setStatuses(statuses);
    this.emitStatusesChange();
  },
  _setStatuses: function(statuses) {
    BrowserStore.setItem("statuses", statuses);
  },
  setStatus: function(user_id, status) {
    var statuses = this.getStatuses();
    statuses[user_id] = status;
    this._setStatuses(statuses);
    this.emitStatusesChange();
  },
  getStatuses: function() {
    return BrowserStore.getItem("statuses", {});
  },
  getStatus: function(id) {
    return this.getStatuses()[id];
  },
  _setPhoneStatus: function(user_id, phoneStatus) {
	  var phoneStatuses = this.getPhoneStatuses();
	  phoneStatuses[user_id] = phoneStatus;
	  this.setPhoneStatuses(phoneStatuses);
  },
  setPhoneStatuses: function(phoneStatuses) {
	  BrowserStore.setItem("phonestatuses", phoneStatuses);
  },
  getPhoneStatuses: function() {
	  return BrowserStore.getItem("phonestatuses", {});
  },
  getPhoneStatus: function(id) {
	    return this.getPhoneStatuses()[id];
  },
});

UserStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {
    case ActionTypes.RECIEVED_PROFILES:
      for(var id in action.profiles) {
        // profiles can have incomplete data, so don't overwrite current user
        if (id === UserStore.getCurrentId()) continue;
        var profile = action.profiles[id];
        UserStore.saveProfile(profile);
        UserStore.emitChange(profile.id);
      }
      break;
    case ActionTypes.RECIEVED_ME:
      UserStore.setCurrentUser(action.me);
      UserStore.emitChange(action.me.id);
      break;
    case ActionTypes.RECIEVED_SESSIONS:
      UserStore.setSessions(action.sessions);
      UserStore.emitSessionsChange();
      break;
    case ActionTypes.RECIEVED_AUDITS:
      UserStore.setAudits(action.audits);
      UserStore.emitAuditsChange();
      break;
    case ActionTypes.RECIEVED_TEAMS:
      UserStore.setTeams(action.teams);
      UserStore.emitTeamsChange();
      break;
    case ActionTypes.RECIEVED_STATUSES:
      UserStore._setStatuses(action.statuses);
      UserStore.emitStatusesChange();
      break;

    case ActionTypes.RECIEVED_MSG:
    	if (action.msg.action === 'user_phone_status') {
    		console.log('**************' + action.msg.user_id + '  ' + action.msg.props.status);
    	    UserStore._setPhoneStatus(action.msg.user_id, action.msg.props.status);
    	    //UserStore.emitPhoneStatusesChange();
    	}
    default:
  }
});

UserStore.setMaxListeners(0);
global.window.UserStore = UserStore;
module.exports = UserStore;
