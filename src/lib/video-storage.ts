/**
 * Video Progress LocalStorage Utilities
 * 
 * Handles storing and retrieving video playback positions in localStorage.
 * Synced periodically with Strapi backend.
 */

const VIDEO_STORAGE_PREFIX = "video_";

/**
 * Video position data
 */
export interface VideoPosition {
    lessonId: string;
    position: number; // seconds
    duration: number; // total video duration in seconds
    lastUpdated: number; // timestamp
}

/**
 * Save video position to localStorage
 * 
 * @param courseId - Course ID
 * @param lessonId - Lesson ID
 * @param position - Current playback position in seconds
 * @param duration - Total video duration in seconds
 * 
 * @example
 * ```ts
 * saveVideoPosition(5, "lesson-123", 142.5, 600);
 * ```
 */
export function saveVideoPosition(
    courseId: number,
    lessonId: string,
    position: number,
    duration: number
): void {
    const key = `${VIDEO_STORAGE_PREFIX}${courseId}_${lessonId}`;
    const data: VideoPosition = {
        lessonId,
        position,
        duration,
        lastUpdated: Date.now(),
    };

    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save video position:", error);
    }
}

/**
 * Get saved video position from localStorage
 * 
 * @param courseId - Course ID
 * @param lessonId - Lesson ID
 * @returns Video position data or null if not found
 * 
 * @example
 * ```ts
 * const position = getVideoPosition(5, "lesson-123");
 * if (position) {
 *   videoElement.currentTime = position.position;
 * }
 * ```
 */
export function getVideoPosition(
    courseId: number,
    lessonId: string
): VideoPosition | null {
    const key = `${VIDEO_STORAGE_PREFIX}${courseId}_${lessonId}`;

    try {
        const data = localStorage.getItem(key);
        if (!data) return null;

        return JSON.parse(data) as VideoPosition;
    } catch (error) {
        console.error("Failed to get video position:", error);
        return null;
    }
}

/**
 * Remove video position from localStorage
 * Typically called when a lesson is completed
 * 
 * @param courseId - Course ID
 * @param lessonId - Lesson ID
 */
export function clearVideoPosition(courseId: number, lessonId: string): void {
    const key = `${VIDEO_STORAGE_PREFIX}${courseId}_${lessonId}`;

    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Failed to clear video position:", error);
    }
}

/**
 * Get all saved video positions
 * 
 * @returns Array of video positions
 */
export function getAllVideoPositions(): VideoPosition[] {
    const positions: VideoPosition[] = [];

    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(VIDEO_STORAGE_PREFIX)) {
                const data = localStorage.getItem(key);
                if (data) {
                    positions.push(JSON.parse(data));
                }
            }
        }
    } catch (error) {
        console.error("Failed to get all video positions:", error);
    }

    return positions;
}

/**
 * Calculate if a video is considered "watched"
 * A video is watched if user has seen at least 90% of it
 * 
 * @param position - Current position in seconds
 * @param duration - Total duration in seconds
 * @returns True if video is considered watched
 */
export function isVideoWatched(position: number, duration: number): boolean {
    if (duration === 0) return false;
    return (position / duration) >= 0.9;
}

/**
 * Format seconds to MM:SS format
 * 
 * @param seconds - Time in seconds
 * @returns Formatted time string
 * 
 * @example
 * ```ts
 * formatTime(142.5); // "02:23"
 * ```
 */
export function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
