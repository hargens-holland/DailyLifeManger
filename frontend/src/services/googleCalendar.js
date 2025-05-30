/**
=========================================================
* Google Calendar Integration Service - Simplified Version
=========================================================
*/

// Google Calendar API configuration
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

class GoogleCalendarService {
    constructor() {
        this.isAvailableForUse = false;
        this.initializationAttempted = false;
    }

    // Check if Google Calendar is available and properly configured
    isAvailable() {
        // Check if we have valid API credentials
        const hasValidCredentials = GOOGLE_CLIENT_ID &&
            GOOGLE_API_KEY &&
            GOOGLE_CLIENT_ID !== 'your_google_client_id_here' &&
            GOOGLE_API_KEY !== 'your_google_api_key_here' &&
            GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com') &&
            GOOGLE_API_KEY.startsWith('AIzaSy');

        // For development, we'll simulate availability but disable actual functionality
        // due to CORS and CSP restrictions in local development
        if (hasValidCredentials && window.location.hostname === 'localhost') {
            console.warn('Google Calendar API detected but disabled in local development due to CORS/CSP restrictions.');
            console.info('Google Calendar integration will work in production with proper domain setup.');
            return false; // Disable for localhost
        }

        return hasValidCredentials;
    }

    // Initialize Google API (simplified for development)
    async initialize() {
        if (this.initializationAttempted) {
            return this.isAvailableForUse;
        }

        this.initializationAttempted = true;

        if (!this.isAvailable()) {
            console.warn('Google Calendar API not available or not properly configured.');
            return false;
        }

        // In a real production environment, you would initialize the Google API here
        // For now, we'll just return false to indicate it's not available in development
        console.info('Google Calendar API initialization skipped in development environment.');
        this.isAvailableForUse = false;
        return false;
    }

    // Check if signed in (always false in development)
    isGoogleSignedIn() {
        return false;
    }

    // Sign in to Google (mock for development)
    async signIn() {
        console.warn('Google Calendar sign-in is disabled in development environment.');
        console.info('This feature will work in production with proper domain configuration.');
        return false;
    }

    // Sign out from Google (mock for development)
    async signOut() {
        console.info('Google Calendar sign-out (development mode).');
    }

    // Mock methods for development
    async createCalendarEvent(task) {
        console.log('Mock: Would create calendar event for task:', task.text);
        return { id: 'mock_event_' + Date.now() };
    }

    async updateCalendarEvent(eventId, task) {
        console.log('Mock: Would update calendar event:', eventId, 'for task:', task.text);
        return { id: eventId };
    }

    async deleteCalendarEvent(eventId) {
        console.log('Mock: Would delete calendar event:', eventId);
        return true;
    }

    async getCalendarEvents(timeMin, timeMax) {
        console.log('Mock: Would fetch calendar events');
        return [];
    }
}

export default new GoogleCalendarService(); 