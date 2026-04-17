const mongoose = require("mongoose");
const BusStand = require("./models/busStandModel");  // Use correct path to match your model structure

const busStandsData = [
    // Dhaka
    {
        name: "Gabtoli Bus Terminal",
        city: "Dhaka",
        address: "Mirpur, Dhaka",
        location: { lat: 23.7867, lng: 90.3413 },
        routes: ["Dhaka-Rajshahi", "Dhaka-Rangpur", "Dhaka-Dinajpur"],
        facilities: ["Ticket Counter", "Waiting Room", "Food Court"]
    },
    {
        name: "Sayedabad Bus Terminal",
        city: "Dhaka",
        address: "Sayedabad, Dhaka",
        location: { lat: 23.7253, lng: 90.4330 },
        routes: ["Dhaka-Chittagong", "Dhaka-Sylhet", "Dhaka-Cox's Bazar"],
        facilities: ["Ticket Counter", "Waiting Room", "Restroom"]
    },
    {
        name: "Mohakhali Bus Terminal",
        city: "Dhaka",
        address: "Mohakhali, Dhaka",
        location: { lat: 23.7785, lng: 90.4059 },
        routes: ["Dhaka-Mymensingh", "Dhaka-Tangail", "Dhaka-Bogura"],
        facilities: ["Ticket Counter", "Waiting Room"]
    },

    // Chittagong
    {
        name: "Dampara Bus Terminal",
        city: "Chittagong",
        address: "Dampara, Chittagong",
        location: { lat: 22.3375, lng: 91.8340 },
        routes: ["Chittagong-Dhaka", "Chittagong-Cox's Bazar", "Chittagong-Rangamati"],
        facilities: ["Ticket Counter", "Waiting Room", "Food Court"]
    },
    {
        name: "Bahaddarhat Bus Terminal",
        city: "Chittagong",
        address: "Bahaddarhat, Chittagong",
        location: { lat: 22.3594, lng: 91.8225 },
        routes: ["Chittagong-Dhaka", "Chittagong-Cox's Bazar"],
        facilities: ["Ticket Counter", "Waiting Room"]
    },
    
    // Sylhet
    {
        name: "Kadamtali Bus Terminal",
        city: "Sylhet",
        address: "Kadamtali, Sylhet",
        location: { lat: 24.8908, lng: 91.8686 },
        routes: ["Sylhet-Dhaka", "Sylhet-Sunamganj"],
        facilities: ["Ticket Counter", "Waiting Room", "Food Court"]
    },
    
    // Rajshahi
    {
        name: "Shiroil Bus Terminal",
        city: "Rajshahi",
        address: "Shiroil, Rajshahi",
        location: { lat: 24.3700, lng: 88.6100 },
        routes: ["Rajshahi-Dhaka", "Rajshahi-Rangpur"],
        facilities: ["Ticket Counter", "Waiting Room"]
    },
    
    // Khulna
    {
        name: "Sonadanga Bus Terminal",
        city: "Khulna",
        address: "Sonadanga, Khulna",
        location: { lat: 22.8200, lng: 89.5519 },
        routes: ["Khulna-Dhaka", "Khulna-Jessore", "Khulna-Satkhira"],
        facilities: ["Ticket Counter", "Waiting Room", "Food Court"]
    },
    
    // Barisal
    {
        name: "Nathullabad Bus Terminal",
        city: "Barisal",
        address: "Nathullabad, Barisal",
        location: { lat: 22.7000, lng: 90.3700 },
        routes: ["Barisal-Dhaka", "Barisal-Khulna"],
        facilities: ["Ticket Counter", "Waiting Room"]
    },
    
    // Rangpur
    {
        name: "Rangpur Bus Terminal",
        city: "Rangpur",
        address: "Central Bus Terminal, Rangpur",
        location: { lat: 25.7466, lng: 89.2513 },
        routes: ["Rangpur-Dhaka", "Rangpur-Dinajpur"],
        facilities: ["Ticket Counter", "Waiting Room"]
    }
];

// Seed the database
const seedDatabase = async () => {
    try {
        // Check if we already have bus stands in the database to prevent duplicates
        const existingStands = await BusStand.countDocuments();
        
        if (existingStands === 0) {
            console.log('No bus stands found, seeding the database...');
            const result = await BusStand.insertMany(busStandsData);
            console.log(`${result.length} bus stands have been added to the database`);
            return true;
        } else {
            console.log(`Database already contains ${existingStands} bus stands, skipping seeding`);
            return false;
        }
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

module.exports = { seedDatabase };