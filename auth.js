(function () {
  const SESSION_KEY = 'bakyenga_saas_session';
  const BUSINESS_KEY = 'bakyenga_current_business';
  const ADMIN_KEY = 'bakyenga_admin_session';
  const BUSINESSES_STORAGE = 'bakyenga_registered_businesses';
  const PENDING_REGISTRATIONS_STORAGE = 'bakyenga_pending_registrations';
  const SUPPORT_TICKETS_STORAGE = 'bakyenga_support_tickets';

  // Developer Admin Credentials (Single hardcoded admin)
  const DEVELOPER_ADMIN = {
    id: 'ADMIN-DEV-001',
    name: 'Ahadi Amos',
    username: 'developer',
    email: 'developer@bakyenga.com',
    password: 'dev123secure',
    role: 'DEVELOPER_ADMIN',
    title: 'System Developer & Administrator',
    avatar: 'AA'
  };

  // Demo approved businesses
  const DEMO_BUSINESSES = [
    {
      id: 'BIZ-001',
      name: 'Bakyenga Traders',
      location: 'Plot 14, High Street, Kampala',
      email: 'admin@bakyenga.com',
      phone: '+256 701 456 789',
      registeredDate: '2026-01-15',
      approvedDate: '2026-01-15',
      status: 'approved',
      subscriptionPlan: 'yearly',
      subscriptionStartDate: '2026-01-15',
      subscriptionEndDate: '2027-01-15',
      subscriptionStatus: 'active',
      admin: { id: 'USR-001', name: 'Brian Bakyenga', username: 'admin', password: 'admin123', role: 'ADMIN', title: 'Main Admin', avatar: 'BB' },
      users: [
        { id: 'USR-002', name: 'Grace Natukunda', username: 'grace', password: 'cashier123', role: 'CASHIER', title: 'Cashier', avatar: 'GN' },
        { id: 'USR-003', name: 'Denis Mugisha', username: 'denis', password: 'cashier456', role: 'CASHIER', title: 'Cashier', avatar: 'DM' }
      ]
    },
    {
      id: 'BIZ-002',
      name: 'Urban Supermarket',
      location: 'Nakasero, Kampala',
      email: 'urban@supermarket.com',
      phone: '+256 702 555 666',
      registeredDate: '2026-02-20',
      approvedDate: '2026-02-20',
      status: 'approved',
      subscriptionPlan: 'monthly',
      subscriptionStartDate: '2026-02-20',
      subscriptionEndDate: '2026-03-20',
      subscriptionStatus: 'active',
      admin: { id: 'USR-101', name: 'Tom Okello', username: 'tom', password: 'tom123', role: 'ADMIN', title: 'Manager', avatar: 'TO' },
      users: [
        { id: 'USR-102', name: 'Susan Namata', username: 'susan', password: 'susan123', role: 'CASHIER', title: 'Cashier', avatar: 'SN' }
      ]
    }
  ];

  // Subscription Plans Configuration
  const SUBSCRIPTION_PLANS = {
    free_trial: {
      name: 'Free Trial',
      duration: 30,
      price: 0,
      features: ['5 products', '1 user', 'Basic reports', 'Email support'],
      description: '30-day free trial to test the system'
    },
    monthly: {
      name: 'Monthly Plan',
      duration: 30,
      price: 50000,
      currency: 'UGX',
      features: ['Unlimited products', '5 users', 'Advanced reports', 'Priority support', 'Daily backups'],
      description: 'Billed monthly'
    },
    yearly: {
      name: 'Yearly Plan',
      duration: 365,
      price: 500000,
      currency: 'UGX',
      features: ['Unlimited products', 'Unlimited users', 'Full analytics', 'Phone support', 'Real-time backups', 'Custom branding'],
      description: 'Billed once per year, save 17%'
    },
    lifetime: {
      name: 'Lifetime License',
      duration: 99999,
      price: 2000000,
      currency: 'UGX',
      features: ['Everything included', 'Lifetime updates', 'Priority 24/7 support', 'Dedicated account manager', 'API access', 'Custom development'],
      description: 'One-time payment for lifetime access'
    }
  };

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function getAdminSession() {
    try {
      const raw = localStorage.getItem(ADMIN_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function getCurrentBusiness() {
    try {
      const raw = localStorage.getItem(BUSINESS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function getAllBusinesses() {
    try {
      const stored = localStorage.getItem(BUSINESSES_STORAGE);
      return stored ? JSON.parse(stored) : DEMO_BUSINESSES;
    } catch (error) {
      return DEMO_BUSINESSES;
    }
  }

  function getPendingRegistrations() {
    try {
      const stored = localStorage.getItem(PENDING_REGISTRATIONS_STORAGE);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  function getSupportTickets() {
    try {
      const stored = localStorage.getItem(SUPPORT_TICKETS_STORAGE);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  function saveBusinesses(businesses) {
    try {
      localStorage.setItem(BUSINESSES_STORAGE, JSON.stringify(businesses));
    } catch (error) {
      console.error('Error saving businesses:', error);
    }
  }

  function savePendingRegistrations(registrations) {
    try {
      localStorage.setItem(PENDING_REGISTRATIONS_STORAGE, JSON.stringify(registrations));
    } catch (error) {
      console.error('Error saving registrations:', error);
    }
  }

  function saveSupportTickets(tickets) {
    try {
      localStorage.setItem(SUPPORT_TICKETS_STORAGE, JSON.stringify(tickets));
    } catch (error) {
      console.error('Error saving tickets:', error);
    }
  }

  function submitBusinessRegistration(businessData) {
    const registrations = getPendingRegistrations();
    const newRegistrationId = `REG-${(registrations.length + 1).toString().padStart(4, '0')}`;
    
    const pendingBusiness = {
      id: newRegistrationId,
      ...businessData,
      submittedDate: new Date().toISOString(),
      status: 'pending',
      adminName: businessData.adminName,
      adminUsername: businessData.adminUsername,
      adminPassword: businessData.adminPassword
    };

    registrations.push(pendingBusiness);
    savePendingRegistrations(registrations);
    return pendingBusiness;
  }

  function approveBusiness(registrationId, subscriptionPlan = 'free_trial') {
    const registrations = getPendingRegistrations();
    const businesses = getAllBusinesses();
    const index = registrations.findIndex(r => r.id === registrationId);
    
    if (index === -1) return null;

    const registration = registrations[index];
    const businessId = `BIZ-${(businesses.length + 1).toString().padStart(3, '0')}`;
    const adminUserId = `USR-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
    
    const planConfig = SUBSCRIPTION_PLANS[subscriptionPlan];
    const now = new Date();
    const endDate = new Date(now.getTime() + planConfig.duration * 24 * 60 * 60 * 1000);
    
    const approvedBusiness = {
      id: businessId,
      name: registration.businessName,
      location: registration.location,
      email: registration.email,
      phone: registration.phone,
      registeredDate: registration.submittedDate.split('T')[0],
      approvedDate: new Date().toISOString().split('T')[0],
      status: 'approved',
      subscriptionPlan: subscriptionPlan,
      subscriptionStartDate: now.toISOString().split('T')[0],
      subscriptionEndDate: endDate.toISOString().split('T')[0],
      subscriptionStatus: subscriptionPlan === 'free_trial' ? 'active' : 'pending_payment',
      admin: {
        id: adminUserId,
        name: registration.adminName,
        username: registration.adminUsername,
        password: registration.adminPassword,
        role: 'ADMIN',
        title: 'Main Admin',
        avatar: registration.adminName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
      },
      users: []
    };

    businesses.push(approvedBusiness);
    saveBusinesses(businesses);
    
    registrations.splice(index, 1);
    savePendingRegistrations(registrations);
    
    return approvedBusiness;
  }

  function rejectBusiness(registrationId, reason = '') {
    const registrations = getPendingRegistrations();
    const index = registrations.findIndex(r => r.id === registrationId);
    
    if (index === -1) return null;

    const registration = registrations[index];
    registration.status = 'rejected';
    registration.rejectionReason = reason;
    registration.rejectionDate = new Date().toISOString();
    
    registrations[index] = registration;
    savePendingRegistrations(registrations);
    
    return registration;
  }

  function submitSupportTicket(businessId, subject, message, category = 'bug_report') {
    const tickets = getSupportTickets();
    const ticketId = `TKT-${(tickets.length + 1).toString().padStart(5, '0')}`;
    
    const ticket = {
      id: ticketId,
      businessId,
      subject,
      message,
      category, // bug_report, feature_request, support
      status: 'open',
      priority: 'normal',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      responses: []
    };

    tickets.push(ticket);
    saveSupportTickets(tickets);
    return ticket;
  }

  function respondToTicket(ticketId, response, status = null) {
    const tickets = getSupportTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) return null;

    ticket.responses.push({
      text: response,
      timestamp: new Date().toISOString(),
      isAdmin: true
    });

    if (status) ticket.status = status;
    ticket.updatedDate = new Date().toISOString();
    
    saveSupportTickets(tickets);
    return ticket;
  }

  function saveSession(user, business) {
    const payload = {
      userId: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      title: user.title,
      avatar: user.avatar
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    localStorage.setItem('bakyenga_current_user_id', user.id);
    
    if (business) {
      localStorage.setItem(BUSINESS_KEY, JSON.stringify(business));
    }
  }

  function saveAdminSession(admin) {
    const payload = {
      userId: admin.id,
      name: admin.name,
      username: admin.username,
      role: admin.role,
      title: admin.title,
      avatar: admin.avatar
    };

    localStorage.setItem(ADMIN_KEY, JSON.stringify(payload));
    localStorage.setItem('bakyenga_admin_user_id', admin.id);
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('bakyenga_current_user_id');
    localStorage.removeItem(BUSINESS_KEY);
  }

  function clearAdminSession() {
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem('bakyenga_admin_user_id');
  }

  function findUserByCredentials(identifier, password) {
    const key = String(identifier || '').trim().toLowerCase();
    const secret = String(password || '').trim();
    const businesses = getAllBusinesses();

    for (let business of businesses) {
      if (business.status !== 'approved') continue;
      
      // Check if subscription is valid
      const endDate = new Date(business.subscriptionEndDate);
      if (endDate < new Date()) {
        business.subscriptionStatus = 'expired';
        continue;
      }

      // Check admin
      if ((business.admin.username.toLowerCase() === key) && business.admin.password === secret) {
        return { user: business.admin, business };
      }
      
      // Check staff users
      const staffUser = business.users.find(u => 
        (u.username.toLowerCase() === key) && u.password === secret
      );
      if (staffUser) {
        return { user: staffUser, business };
      }
    }

    return null;
  }

  function verifyDeveloperCredentials(identifier, password) {
    const key = String(identifier || '').trim().toLowerCase();
    const secret = String(password || '').trim();

    if ((DEVELOPER_ADMIN.username.toLowerCase() === key || DEVELOPER_ADMIN.email.toLowerCase() === key) && 
        DEVELOPER_ADMIN.password === secret) {
      return DEVELOPER_ADMIN;
    }
    return null;
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

    return true;
  }

  window.BakyengaAuth = {
    DEVELOPER_ADMIN,
    SUBSCRIPTION_PLANS,
    DEMO_BUSINESSES,
    SESSION_KEY,
    BUSINESS_KEY,
    ADMIN_KEY,
    BUSINESSES_STORAGE,
    PENDING_REGISTRATIONS_STORAGE,
    SUPPORT_TICKETS_STORAGE,
    getSession,
    getAdminSession,
    getCurrentBusiness,
    getAllBusinesses,
    getPendingRegistrations,
    getSupportTickets,
    saveBusinesses,
    savePendingRegistrations,
    saveSupportTickets,
    submitBusinessRegistration,
    approveBusiness,
    rejectBusiness,
    submitSupportTicket,
    respondToTicket,
    saveSession,
    saveAdminSession,
    clearSession,
    clearAdminSession,
    findUserByCredentials,
    verifyDeveloperCredentials,
    requireAuth
  };

  // Initialize demo data
  if (!localStorage.getItem(BUSINESSES_STORAGE)) {
    localStorage.setItem(BUSINESSES_STORAGE, JSON.stringify(DEMO_BUSINESSES));
  }
})();
