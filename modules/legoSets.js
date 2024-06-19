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