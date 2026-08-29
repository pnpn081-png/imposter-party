import { Category } from '../types/game';

// Specific theme categories with simple, everyday words
export const BASE_CATEGORIES: Category[] = [
  {
    id: 'fruits_food',
    name: 'Fruits & Food',
    icon: 'UtensilsCrossed',
    description: 'Everyday delicious food, fruits, snacks, and treats',
    words: [
      'Apple', 'Banana', 'Orange', 'Strawberry', 'Watermelon',
      'Pizza', 'Burger', 'Ice Cream', 'Cake', 'Chocolate',
      'Cookie', 'Bread', 'Milk', 'Egg', 'Cheese',
      'Sandwich', 'Tomato', 'Popcorn', 'Candy', 'French Fries'
    ]
  },
  {
    id: 'animals',
    name: 'Animals',
    icon: 'Cat',
    description: 'Friendly and wild creatures everyone knows',
    words: [
      'Dog', 'Cat', 'Lion', 'Elephant', 'Monkey',
      'Tiger', 'Bear', 'Rabbit', 'Duck', 'Horse',
      'Cow', 'Sheep', 'Frog', 'Bird', 'Fish',
      'Pig', 'Mouse', 'Dolphin', 'Giraffe', 'Penguin'
    ]
  },
  {
    id: 'household_objects',
    name: 'Everyday Objects',
    icon: 'Home',
    description: 'Common household items, furniture, and tools',
    words: [
      'Chair', 'Table', 'Bed', 'Clock', 'Mirror',
      'Cup', 'Bottle', 'Door', 'Lamp', 'Pillow',
      'Towel', 'Key', 'Book', 'Phone', 'Shoes',
      'Bag', 'Glasses', 'Spoon', 'Fork', 'Blanket'
    ]
  },
  {
    id: 'places',
    name: 'Places',
    icon: 'MapPin',
    description: 'Everyday locations, rooms, and familiar places',
    words: [
      'School', 'Hospital', 'Park', 'Beach', 'Library',
      'Airport', 'Kitchen', 'Supermarket', 'Cinema', 'Restaurant',
      'Hotel', 'Forest', 'Zoo', 'Bank', 'Museum',
      'Castle', 'Playground', 'Swimming Pool', 'Bedroom', 'Garden'
    ]
  },
  {
    id: 'sports_fun',
    name: 'Sports & Fun',
    icon: 'Trophy',
    description: 'Favorite sports, games, and outdoor activities',
    words: [
      'Football', 'Basketball', 'Tennis', 'Swimming', 'Dancing',
      'Running', 'Guitar', 'Bicycle', 'Painting', 'Skating',
      'Singing', 'Video Game', 'Chess', 'Kite', 'Jump Rope',
      'Baseball', 'Boxing', 'Fishing', 'Bowling', 'Camping'
    ]
  },
  {
    id: 'roles',
    name: 'Roles',
    icon: 'Briefcase',
    description: 'Everyday occupations, careers, and workers',
    words: [
      'Doctor', 'Teacher', 'Police Officer', 'Firefighter', 'Chef',
      'Pilot', 'Dentist', 'Singer', 'Farmer', 'Bus Driver',
      'Nurse', 'Astronaut', 'Artist', 'Photographer', 'Magician',
      'Baker', 'Builder', 'Scientist', 'Vet', 'Coach'
    ]
  },
  {
    id: 'nature_weather',
    name: 'Nature & Weather',
    icon: 'Sun',
    description: 'Sun, rain, seasons, and elements of nature',
    words: [
      'Sun', 'Moon', 'Rain', 'Snow', 'Rainbow',
      'Cloud', 'Mountain', 'River', 'Tree', 'Flower',
      'Ocean', 'Star', 'Wind', 'Forest', 'Island',
      'Fire', 'Desert', 'Waterfall', 'Lightning', 'Beach'
    ]
  },
  {
    id: 'clothes_wear',
    name: 'Clothes & Wear',
    icon: 'Shirt',
    description: 'Everyday clothing, accessories, and shoes',
    words: [
      'Shirt', 'Pants', 'Hat', 'Shoes', 'Socks',
      'Jacket', 'Dress', 'Gloves', 'Scarf', 'Belt',
      'Sunglasses', 'Watch', 'Boots', 'Ring', 'Backpack',
      'Umbrella', 'Coat', 'Cap', 'Sweater', 'Sandals'
    ]
  },
  {
    id: 'space_planets',
    name: 'Space & Cosmos',
    icon: 'Rocket',
    description: 'Planets, astronauts, stars, and celestial wonders',
    words: [
      'Sun', 'Moon', 'Mars', 'Star', 'Rocket',
      'Astronaut', 'Spaceship', 'Earth', 'Black Hole', 'Comet',
      'Telescope', 'Galaxy', 'Alien', 'Satellite', 'Meteor'
    ]
  },
  {
    id: 'fantasy_magic',
    name: 'Fantasy & Magic',
    icon: 'Sparkles',
    description: 'Dragons, wizards, fairy tales, and magical treasures',
    words: [
      'Dragon', 'Wizard', 'Magic Wand', 'Potion', 'Sword',
      'Unicorn', 'Castle', 'Crown', 'Treasure', 'Fairy',
      'Ghost', 'Spell', 'Shield', 'Monster', 'Genie'
    ]
  }
];

// All words combined for the Random Words button
const ALL_WORDS = Array.from(new Set(BASE_CATEGORIES.flatMap(cat => cat.words)));

export const RANDOM_CATEGORY: Category = {
  id: 'random_words',
  name: '🎲 Random Words',
  icon: 'Dices',
  description: 'Random surprise words chosen from all categories combined',
  words: ALL_WORDS
};

// Full list of available categories (with Random Words first)
export const GAME_CATEGORIES: Category[] = [
  RANDOM_CATEGORY,
  ...BASE_CATEGORIES
];

export const DEFAULT_PLAYERS = [
  'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6', 'Player 7', 'Player 8', 'Player 9', 'Player 10', 'Player 11', 'Player 12'
];
