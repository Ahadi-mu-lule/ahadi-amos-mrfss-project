(function () {
  const SESSION_KEY = 'bakyenga_saas_session';

  const USERS = [
    { id: 'USR-001', name: 'Brian Bakyenga', username: 'admin', email: 'admin@bakyenga.com', password: 'admin123', role: 'ADMIN', title: 'Main Admin / Store Owner', avatar: 'BB' },
    { id: 'USR-002', name: 'Grace Natukunda', username: 'grace', email: 'grace@bakyenga.com', password: 'cashier123', role: 'CASHIER', title: 'Cashier / Sales Associate', avatar: 'GN' },
    { id: 'USR-003', name: 'Denis Mugisha', username: 'denis', email: 'denis@bakyenga.com', password: 'cashier456', role: 'CASHIER', title: 'Shop Assistant / Cashier', avatar: 'DM' }
  ];

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveSession(user) {
    const payload = {
      userId: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      title: user.title,
      avatar: user.avatar || user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    localStorage.setItem('bakyenga_current_user_id', user.id);
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('bakyenga_current_user_id');
  }

  function findUserByCredentials(identifier, password) {
    const key = String(identifier || '').trim().toLowerCase();
    const secret = String(password || '').trim();

    return USERS.find((user) => {
      const matchesIdentifier =
        user.email.toLowerCase() === key ||
        user.username.toLowerCase() === key ||
        user.name.toLowerCase() === key;

      return matchesIdentifier && user.password === secret;
    });
  }

  function requireAuth() {
    const path = window.location.pathname.toLowerCase();
    const isLoginPage = path.endsWith('/login.html') || path.endsWith('/login');
    const session = getSession();

    if (isLoginPage) {
      if (session) {
        window.location.replace('/index.html');
      }
      return true;
    }

    if (!session) {
      window.location.replace('/login.html');
      return false;
    }

    localStorage.setItem('bakyenga_current_user_id', session.userId);
    return true;
  }

  function bindLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const errorBox = document.getElementById('authError');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const identifier = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const user = findUserByCredentials(identifier, password);

      if (!user) {
        if (errorBox) {
          errorBox.textContent = 'Invalid username/email or password.';
        }
        return;
      }

      saveSession(user);
      window.location.href = '/index.html';
    });
  }

  function bindLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
      clearSession();
      window.location.href = '/login.html';
    });
  }

  window.BakyengaAuth = {
    USERS,
    SESSION_KEY,
    getSession,
    saveSession,
    clearSession,
    findUserByCredentials,
    requireAuth,
    bindLoginForm,
    bindLogoutButton
  };

  document.addEventListener('DOMContentLoaded', () => {
    bindLoginForm();
    bindLogoutButton();

    const path = window.location.pathname.toLowerCase();
    const isLoginPage = path.endsWith('/login.html') || path.endsWith('/login');

    if (!isLoginPage && !getSession()) {
      window.location.replace('/login.html');
    }

    if (isLoginPage && getSession()) {
      window.location.replace('/index.html');
    }
  });
})();
