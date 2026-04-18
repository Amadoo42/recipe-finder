/**
 * DB Seeder Utility
 * Loads dummyData JSON string into localStorage. There is already some dummyData here, but you can replace it and run your own.
 * This tracked file is intended for local development seed data only; do not store real secrets or sensitive data here.
 */
import { hash } from './hash.js'; 

const DUMMY_DESC = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec ipsum eu ipsum sagittis ullamcorper. Cras nisl mi, eleifend non felis sit amet, suscipit condimentum enim. Nulla facilisi. Nunc rutrum tincidunt arcu vitae consequat. Cras condimentum velit eu interdum porta. Sed posuere sem nisi, sed suscipit metus fringilla in. Nulla enim risus, maximus eu erat eu, gravida laoreet lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Nunc congue turpis aliquet, ornare dolor at, sollicitudin neque. Vestibulum non dolor vel urna bibendum commodo. Cras orci erat, ullamcorper quis laoreet sit amet, convallis at purus. Sed id ultrices ex, eu sollicitudin ipsum. Integer laoreet magna diam, vitae auctor velit lacinia nec. Nam eget dictum erat. In sollicitudin lacus at velit efficitur sodales. ";

const users = [
    {
        firstName: "Amadoo", lastName: "Amadoo", username: "Amadoo", email: "amadoo@mail.com",
        passwordHash: "password123", role: "user", savedRecipes: [], token: null
    },
    {
        firstName: "Admin", lastName: "Admin", username: "Admin", email: "admin@mail.com",
        passwordHash: "password123", role: "admin", savedRecipes: [], token: null
    }
];

const recipes = [
    {
        name: "Linguine with leeks and mushrooms", description: DUMMY_DESC, courseType: "Main",
        ingredients: [{name: "Sugar", quantity: 1, unit: "Cups"}, {name: "Somethign", quantity: 2, unit: "Cups"}, {name: "Yes", quantity: 3, unit: "Cups"}, {name: "Oh yeah", quantity: 51, unit: "Pieces"}],
        image: "https://www.bhf.org.uk/-/media/images/information-support/support/healthy-living/recipes-new/linguine-with-leeks-and-mushrooms_800x600.jpg", id: 1
    },
    {
        name: "Garlic and lemon prawns with courgettes", description: DUMMY_DESC, courseType: "Appetizers",
        ingredients: [{name: "Aha", quantity: 12, unit: "Cups"}],
        image: "https://www.bhf.org.uk/-/media/images/information-support/support/healthy-living/recipes-new/garlic-and-lemon-prawns-noexp-800x600.jpg", id: 2
    },
    {
        name: "Roasted red peppers with mozzarella and anchovies", description: DUMMY_DESC, courseType: "Appetizers",
        ingredients: [{name: "Yep", quantity: 2, unit: "Cups"}],
        image: "https://www.bhf.org.uk/-/media/images/information-support/support/healthy-living/recipes-new/roasted-red-peppers-noexp-800x600.jpg", id: 3
    },
    {
        name: "Patatas bravas", description: DUMMY_DESC, courseType: "Dessert",
        ingredients: [{name: "Somethign", quantity: 3, unit: "Cups"}],
        image: "https://www.bhf.org.uk/-/media/images/information-support/support/healthy-living/recipes-new/patatas-bravas-noexp-800x600.jpg", id: 4
    },
    {
        name: "Beetroot hummus", description: DUMMY_DESC, courseType: "Main",
        ingredients: [{name: "Oh yeah", quantity: 312, unit: "Cups"}],
        image: "https://www.bhf.org.uk/-/media/images/information-support/support/healthy-living/recipes-new/beetroot-hummus_620x400.jpg", id: 5
    },
    {
        name: "Carrot and coriander soup", description: DUMMY_DESC, courseType: "Appetizers",
        ingredients: [{name: "Yes", quantity: 31232, unit: "Cups"}],
        image: "https://www.bhf.org.uk/-/media/images/information-support/support/healthy-living/recipes-new/carrot-and-coriander-soup_620x400.jpg", id: 6
    }
];

const seedDatabase = () => {
    try {
        const confirmSeed = confirm(
            "⚠️ WARNING: This will delete all current local data and replace it with dummy data. Proceed?"
        );
        
        if (confirmSeed) {
            localStorage.clear();

            const hashedUsers = users.map(user => {
                return { ...user, passwordHash: hash("password123") };
            });

            const dataToStore = {
                users: JSON.stringify(hashedUsers),
                recipes: JSON.stringify(recipes),
                session: null
            };

            Object.keys(dataToStore).forEach(key => {
                const value = dataToStore[key];
                if (value === null) {
                    localStorage.removeItem(key);
                    return;
                }
                localStorage.setItem(
                    key,
                    typeof value === "string" ? value : JSON.stringify(value)
                );
            });
            
            console.log("✅ Database seeded successfully! Login with 'password123'.");
            
            if (confirm("Reload page to see changes?")) {
                window.location.reload();
            }
        }
    } 
    catch (error) {
        console.error("❌ Failed to seed database:", error);
    }
};

export default seedDatabase;
window.seedDatabase = seedDatabase;