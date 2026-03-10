import bcrypt from 'bcrypt';

// In-memory user storage (fallback when MongoDB is unavailable)
export let users = [];

export const InMemoryUser = {
  // Find user by email
  findOne: async function(query) {
    if (query.email) {
      const user = users.find(u => u.email === query.email);
      if (user) {
        // Add comparePassword method to the user object
        user.comparePassword = async function(enteredPassword) {
          return await bcrypt.compare(enteredPassword, this.password);
        };
      }
      return user || null;
    }
    return null;
  },

  // Create new user
  create: async function(userData) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      _id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      isSeller: userData.isSeller || false,
      createdAt: new Date(),
      comparePassword: async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      },
    };

    users.push(newUser);
    return newUser;
  },

  // Find by ID
  findById: async function(id) {
    return users.find(u => u._id === id) || null;
  },
};

