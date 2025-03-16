// Create audio elements for sound effects
let correctSound: HTMLAudioElement;
let incorrectSound: HTMLAudioElement;
let tickSound: HTMLAudioElement;
let successSound: HTMLAudioElement;

// Initialize sounds only in browser environment
const initSounds = () => {
  if (typeof window !== "undefined") {
    correctSound = new Audio("https://cdn.freesound.org/previews/220/220173_0_correctanswer.mp3");
    incorrectSound = new Audio("https://cdn.freesound.org/previews/220/220174_0_wronganswer.mp3");
    tickSound = new Audio("https://cdn.freesound.org/previews/254/254316_4105232-lq_clocktick.mp3");
    successSound = new Audio("https://cdn.freesound.org/previews/388/388713_7312795-lq_success-fanfare.mp3");
    
    // Lower volume for better user experience
    correctSound.volume = 0.5;
    incorrectSound.volume = 0.5;
    tickSound.volume = 0.2;
    successSound.volume = 0.4;
  }
};

// Call init on module load
initSounds();

export const playCorrectSound = () => {
  if (correctSound) {
    correctSound.currentTime = 0;
    correctSound.play().catch(e => console.error("Error playing sound:", e));
  }
};

export const playIncorrectSound = () => {
  if (incorrectSound) {
    incorrectSound.currentTime = 0;
    incorrectSound.play().catch(e => console.error("Error playing sound:", e));
  }
};

export const playTickSound = () => {
  if (tickSound) {
    tickSound.currentTime = 0;
    tickSound.play().catch(e => console.error("Error playing sound:", e));
  }
};

export const playSuccessSound = () => {
  if (successSound) {
    successSound.currentTime = 0;
    successSound.play().catch(e => console.error("Error playing sound:", e));
  }
};
