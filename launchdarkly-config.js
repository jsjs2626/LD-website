// LaunchDarkly Configuration
class LaunchDarklyManager {
    constructor() {
        this.client = null;
        this.user = null;
        this.featureFlags = {
            'calculator-preview-visible': true,
            'hero-title-variant': 'default',
            'feature-personalized-enabled': true,
            'feature-compare-enabled': true,
            'feature-unbiased-enabled': true,
            'feature-savings-enabled': true
        };
    }

    async initialize() {
        try {
            // Create anonymous user context
            this.user = {
                key: 'anonymous-' + Math.random().toString(36).substr(2, 9),
                anonymous: true
            };

            // Initialize LaunchDarkly client
            this.client = window.LDClient.initialize('68f00301acf74e09a6ccb56d', this.user);
            
            await this.client.waitForInitialization();
            
            // Get feature flag values
            this.updateFeatureFlags();
            
            // Listen for flag changes
            this.client.on('change', () => {
                this.updateFeatureFlags();
                this.applyFeatureFlags();
            });
            
            // Apply initial flags
            this.applyFeatureFlags();
            
        } catch (error) {
            console.warn('LaunchDarkly initialization failed, using defaults:', error);
            this.applyFeatureFlags();
        }
    }

    updateFeatureFlags() {
        if (!this.client) return;
        
        this.featureFlags = {
            'calculator-preview-visible': this.client.variation('calculator-preview-visible', true),
            'hero-title-variant': this.client.variation('hero-title-variant', 'default'),
            'feature-personalized-enabled': this.client.variation('feature-personalized-enabled', true),
            'feature-compare-enabled': this.client.variation('feature-compare-enabled', true),
            'feature-unbiased-enabled': this.client.variation('feature-unbiased-enabled', true),
            'feature-savings-enabled': this.client.variation('feature-savings-enabled', true)
        };
    }

    applyFeatureFlags() {
        // Toggle calculator preview visibility
        const calculatorSection = document.getElementById('calculator-section');
        if (calculatorSection) {
            calculatorSection.style.display = this.featureFlags['calculator-preview-visible'] ? 'block' : 'none';
        }

        // Apply hero title variant
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) {
            switch (this.featureFlags['hero-title-variant']) {
                case 'alternative':
                    heroTitle.textContent = 'Discover Your Ideal Credit Card Match';
                    break;
                case 'benefit-focused':
                    heroTitle.textContent = 'Maximize Your Credit Card Rewards';
                    break;
                default:
                    heroTitle.textContent = 'Find Your Perfect Credit Card';
            }
        }

        // Toggle feature cards
        this.toggleFeatureCard('feature-personalized', this.featureFlags['feature-personalized-enabled']);
        this.toggleFeatureCard('feature-compare', this.featureFlags['feature-compare-enabled']);
        this.toggleFeatureCard('feature-unbiased', this.featureFlags['feature-unbiased-enabled']);
        this.toggleFeatureCard('feature-savings', this.featureFlags['feature-savings-enabled']);
    }

    toggleFeatureCard(elementId, isEnabled) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = isEnabled ? 'block' : 'none';
        }
    }

    // Track events for analytics
    trackEvent(eventName, data = {}) {
        if (this.client) {
            this.client.track(eventName, data);
        }
    }
}

// Initialize LaunchDarkly when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ldManager = new LaunchDarklyManager();
    window.ldManager.initialize();
});
