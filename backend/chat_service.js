//
// ChatService
//

module.exports = new ChatService();

function ChatService() {

}

ChatService.prototype.init = function(redisClient) {
  this.redisClient = redisClient;
};

ChatService.prototype.getHistory = function(callback) {
};