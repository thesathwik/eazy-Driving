// Simulated authentication service
// In production, this would connect to a real backend API

const USERS_STORAGE_KEY = 'eazydriving_users';
const SESSION_STORAGE_KEY = 'eazydriving_session';

// Helper to get all users from storage
const getAllUsers = () => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// Helper to save users to storage
const saveUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
};

// Simple password hashing simulation (in production, use proper backend hashing)
const hashPassword = (password) => {
  // This is NOT secure - only for demonstration
  // In production, passwords should be hashed on the backend
  return btoa(password + 'eazydriving_salt');
};

// Verify password
const verifyPassword = (password, hashedPassword) => {
  return hashPassword(password) === hashedPassword;
};

// Check if email already exists
export const checkEmailExists = (email) => {
  const users = getAllUsers();
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
};

// Register a new user
export const registerUser = async (userData) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      try {
        // Validate input
        if (!userData.email || !userData.password) {
          reject({ message: 'Email and password are required' });
          return;
        }

        // Check if user already exists
        if (checkEmailExists(userData.email)) {
          reject({
            message: 'An account with this email already exists',
            field: 'email'
          });
          return;
        }

        // Get existing users
        const users = getAllUsers();

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          email: userData.email.toLowerCase(),
          password: hashPassword(userData.password),
          type: userData.type,
          firstName: userData.firstName,
          lastName: userData.lastName,
          name: `${userData.firstName} ${userData.lastName}`,
          phone: userData.phone,
          location: userData.location || null,
          licenceNumber: userData.licenceNumber || null,
          transmission: userData.transmission || null,
          experience: userData.experience || null,
          createdAt: new Date().toISOString(),
          isVerified: false
        };

        // Add to users array
        users.push(newUser);

        // Save to storage
        if (!saveUsers(users)) {
          reject({ message: 'Failed to save user data' });
          return;
        }

        // Create session without password
        const userSession = { ...newUser };
        delete userSession.password;

        // Save session
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userSession));

        resolve({
          success: true,
          user: userSession,
          message: 'Account created successfully'
        });

      } catch (error) {
        reject({
          message: 'An error occurred during registration',
          error: error.message
        });
      }
    }, 800); // Simulate network delay
  });
};

// Login user
export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      try {
        // Validate input
        if (!email || !password) {
          reject({ message: 'Email and password are required' });
          return;
        }

        // Get all users
        const users = getAllUsers();

        // Find user by email
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
          reject({
            message: 'No account found with this email address',
            field: 'email'
          });
          return;
        }

        // Verify password
        if (!verifyPassword(password, user.password)) {
          reject({
            message: 'Incorrect password. Please try again.',
            field: 'password'
          });
          return;
        }

        // Create session without password
        const userSession = { ...user };
        delete userSession.password;

        // Save session
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userSession));

        resolve({
          success: true,
          user: userSession,
          message: 'Login successful'
        });

      } catch (error) {
        reject({
          message: 'An error occurred during login',
          error: error.message
        });
      }
    }, 800); // Simulate network delay
  });
};

// Get current session
export const getCurrentSession = () => {
  try {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error reading session:', error);
    return null;
  }
};

// Logout user
export const logoutUser = () => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
          reject({ message: 'User not found' });
          return;
        }

        // Update user
        users[userIndex] = {
          ...users[userIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };

        // Save updated users
        if (!saveUsers(users)) {
          reject({ message: 'Failed to update user data' });
          return;
        }

        // Update session
        const updatedUser = { ...users[userIndex] };
        delete updatedUser.password;
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));

        resolve({
          success: true,
          user: updatedUser,
          message: 'Profile updated successfully'
        });

      } catch (error) {
        reject({
          message: 'An error occurred during update',
          error: error.message
        });
      }
    }, 500);
  });
};

// Change password
export const changePassword = async (userId, currentPassword, newPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = getAllUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
          reject({ message: 'User not found' });
          return;
        }

        // Verify current password
        if (!verifyPassword(currentPassword, user.password)) {
          reject({ message: 'Current password is incorrect' });
          return;
        }

        // Update password
        const userIndex = users.findIndex(u => u.id === userId);
        users[userIndex].password = hashPassword(newPassword);
        users[userIndex].updatedAt = new Date().toISOString();

        // Save updated users
        if (!saveUsers(users)) {
          reject({ message: 'Failed to update password' });
          return;
        }

        resolve({
          success: true,
          message: 'Password changed successfully'
        });

      } catch (error) {
        reject({
          message: 'An error occurred during password change',
          error: error.message
        });
      }
    }, 500);
  });
};

// Get user by email (for demonstration - in production this should be protected)
export const getUserByEmail = (email) => {
  const users = getAllUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    const userCopy = { ...user };
    delete userCopy.password;
    return userCopy;
  }
  return null;
};

// Password reset request (simulation)
export const requestPasswordReset = async (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!checkEmailExists(email)) {
        // Don't reveal if email exists for security
        resolve({
          success: true,
          message: 'If an account exists with this email, you will receive password reset instructions'
        });
        return;
      }

      resolve({
        success: true,
        message: 'Password reset email sent successfully'
      });
    }, 1000);
  });
};
