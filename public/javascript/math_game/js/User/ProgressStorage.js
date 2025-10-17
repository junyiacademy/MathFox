// LocalStorage-based progress management
const STORAGE_KEY = 'mathfox_progress';

/**
 * Get completed stages from localStorage
 * @returns {Array<string>} Array of completed stage IDs
 */
export const getCompletedStages = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    const progress = JSON.parse(data);
    return progress.completedStages || [];
  } catch (error) {
    console.error('Error reading progress from localStorage:', error);
    return [];
  }
};

/**
 * Save a completed stage to localStorage
 * @param {string} stageId - The ID of the completed stage
 * @returns {boolean} Success status
 */
export const saveCompletedStage = (stageId) => {
  try {
    const completedStages = getCompletedStages();

    // Don't add if already completed
    if (completedStages.includes(stageId)) {
      console.log(`Stage ${stageId} already completed`);
      return true;
    }

    // Add new stage
    completedStages.push(stageId);

    const progress = {
      completedStages,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    console.log(`Saved stage ${stageId} to localStorage. Total stages: ${completedStages.length}`);
    return true;
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
    return false;
  }
};

/**
 * Clear all progress (useful for testing or reset)
 */
export const clearProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Progress cleared');
    return true;
  } catch (error) {
    console.error('Error clearing progress:', error);
    return false;
  }
};

/**
 * Get progress info for debugging
 */
export const getProgressInfo = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { completedStages: [], totalStages: 0, lastUpdated: null };
    }
    const progress = JSON.parse(data);
    return {
      completedStages: progress.completedStages || [],
      totalStages: (progress.completedStages || []).length,
      lastUpdated: progress.lastUpdated
    };
  } catch (error) {
    console.error('Error reading progress info:', error);
    return { completedStages: [], totalStages: 0, lastUpdated: null, error: error.message };
  }
};

// Export progress info to window for console debugging
if (typeof window !== 'undefined') {
  window.MathFoxProgress = {
    getCompleted: getCompletedStages,
    save: saveCompletedStage,
    clear: clearProgress,
    info: getProgressInfo
  };
}
