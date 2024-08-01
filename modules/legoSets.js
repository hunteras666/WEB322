// modules/legoSets.js

require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  }
});

// Theme model
const Theme = sequelize.define(
  'Theme',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

// Set model
const Set = sequelize.define(
  'Set',
  {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Set.belongsTo(Theme, { foreignKey: 'theme_id' });

// Initialize database
function initialize() { 
  return sequelize.authenticate()
    .then(() => sequelize.sync())
    .then(() => Promise.resolve())
    .catch(err => Promise.reject(`Unable to connect to the database: ${err.message}`));
}

// Get all sets
function getAllSets() {
  return new Promise(async (resolve, reject) => {
    try {
      let sets = await Set.findAll({ include: [Theme] });
      resolve(sets);
    } catch (err) {
      reject(err.message);
    }
  });
}

// Get all themes
function getAllThemes() {
  return new Promise(async (resolve, reject) => {
    try {
      let themes = await Theme.findAll();
      resolve(themes);
    } catch (err) {
      reject(err.message);
    }
  });
}

// Get set by number
function getSetByNum(setNum) {
  return new Promise(async (resolve, reject) => {
    try {
      let foundSet = await Set.findAll({ include: [Theme], where: { set_num: setNum } });
      if (foundSet.length > 0) {
        resolve(foundSet[0]);
      } else {
        reject("Unable to find requested set");
      }
    } catch (err) {
      reject(err.message);
    }
  });
}

// Get sets by theme
function getSetsByTheme(theme) {
  return new Promise(async (resolve, reject) => {
    try {
      let foundSets = await Set.findAll({
        include: [Theme],
        where: {
          '$Theme.name$': {
            [Sequelize.Op.iLike]: `%${theme}%`
          }
        }
      });
      if (foundSets.length > 0) {
        resolve(foundSets);
      } else {
        reject("Unable to find requested sets");
      }
    } catch (err) {
      reject(err.message);
    }
  });
}

// Add a set
function addSet(setData) {
  return new Promise(async (resolve, reject) => {
    try {
      await Set.create(setData);
      resolve();
    } catch (err) {
      reject(err.errors[0].message);
    }
  });
}

// Edit a set
function editSet(set_num, setData) {
  return new Promise(async (resolve, reject) => {
    try {
      await Set.update(setData, { where: { set_num: set_num } });
      resolve();
    } catch (err) {
      reject(err.errors[0].message);
    }
  });
}

// Delete a set
function deleteSet(set_num) {
  return new Promise(async (resolve, reject) => {
    try {
      await Set.destroy({ where: { set_num: set_num } });
      resolve();
    } catch (err) {
      reject(err.errors[0].message);
    }
  });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, getAllThemes, addSet, editSet, deleteSet };
// modules/legoSets.js
const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            sets = setData.map(set => {
                const theme = themeData.find(theme => theme.id == set.theme_id)?.name || "Unknown";
                return { ...set, theme };
            });
            resolve();
        } catch (error) {
            reject("Error initializing data");
        }
    });
}

function getAllSets() {
    return new Promise((resolve, reject) => {
        resolve(sets);
    });
}

function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        const set = sets.find(set => set.set_num === setNum);
        set ? resolve(set) : reject("Set not found");
    });
}

function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        const matchingSets = sets.filter(set => set.theme.toLowerCase().includes(theme.toLowerCase()));
        matchingSets.length ? resolve(matchingSets) : reject("No sets found for the given theme");
    });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };

// Test code (to be removed or commented out after testing)
initialize().then(() => {
    console.log("Initialization complete.");

    // Test getAllSets
    getAllSets().then(data => {
        console.log("All Sets:");
        console.log(data);
    });

    // Test getSetByNum with a known set_num (replace "001-1" with an actual set_num from your data)
    getSetByNum("001-1").then(data => {
        console.log("Set with set_num '001-1':");
        console.log(data);
    }).catch(err => {
        console.error(err);
    });

    // Test getSetsByTheme with a known theme (replace "tech" with an actual theme from your data)
    getSetsByTheme("tech").then(data => {
        console.log("Sets with theme containing 'tech':");
        console.log(data);
    }).catch(err => {
        console.error(err);
    });

}).catch(error => {
    console.error("Error during initialization:", error);
});