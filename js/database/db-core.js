/**
 * db-core.js
 * Core database utilities for reading and writing to localStorage.
 * DO NOT use these directly in the UI components. Use the specific API functions instead.
 */

// Helper functions to read/write tables in localStorage. Each "table" is just a JSON string representing an array of objects.
export function readTable(tableName) {
    let data = localStorage.getItem(tableName);
    return data ? JSON.parse(data) : null;
}

export function writeTable(tableName, data) {
    localStorage.setItem(tableName, JSON.stringify(data));
}

// This basically just initializes the database with empty tables if they don't exist. 
// We can change this to mock data for testing later
export function initDB() {
    if(!readTable('users')) {
        writeTable('users', []);
    }

    if(!readTable('recipes')) {
        writeTable('recipes', []);
    }

    if(!localStorage.getItem('session')) {
        localStorage.removeItem('session'); // Just to be safe and ensure it's not set to some invalid value
    }
}

initDB();