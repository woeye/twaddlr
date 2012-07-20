define(['views/app-view', 'views/login-view', 'views/register-view', 'views/chat-view'], 
  function(AppView, LoginView, RegisterView, ChatView) {
    return {
      AppView: AppView,
      LoginView: LoginView,
      RegisterView: RegisterView,
      ChatView: ChatView
    }
  }
);
