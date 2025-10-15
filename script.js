// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    initializeSmoothScroll();
    initializeEventTracking();
});

// Calculator functionality
function initializeCalculator() {
    const monthlySpending = document.getElementById('monthly-spending');
    const creditScore = document.getElementById('credit-score');
    const currentCards = document.getElementById('current-cards');
    const recommendationCards = document.getElementById('recommendation-cards');

    function updateRecommendations() {
        const spending = parseInt(monthlySpending.value) || 0;
        const score = creditScore.value;
        const cards = currentCards.value;

        if (spending > 0 && score && cards !== '') {
            const recommendations = generateRecommendations(spending, score, cards);
            displayRecommendations(recommendations);
        } else {
            recommendationCards.innerHTML = '<p class="placeholder">Fill out the form above to see recommendations</p>';
        }
    }

    // Add event listeners
    [monthlySpending, creditScore, currentCards].forEach(input => {
        input.addEventListener('input', updateRecommendations);
        input.addEventListener('change', updateRecommendations);
    });
}

function generateRecommendations(spending, score, cards) {
    const recommendations = [];
    
    // Basic recommendation logic based on inputs
    if (score === '800-850' && spending >= 3000) {
        recommendations.push({
            name: 'Premium Travel Card',
            description: 'High rewards for frequent travelers',
            annualFee: '$550',
            rewards: '3x on travel, 1x on everything else'
        });
    }
    
    if (score === '740-799' && spending >= 2000) {
        recommendations.push({
            name: 'Cash Back Card',
            description: '2% cash back on all purchases',
            annualFee: '$0',
            rewards: '2% cash back on everything'
        });
    }
    
    if (score === '670-739' && spending >= 1000) {
        recommendations.push({
            name: 'Rewards Card',
            description: 'Good rewards with no annual fee',
            annualFee: '$0',
            rewards: '1.5% cash back on all purchases'
        });
    }
    
    if (score === '580-669' || cards === '0') {
        recommendations.push({
            name: 'Starter Card',
            description: 'Build credit with responsible use',
            annualFee: '$0',
            rewards: '1% cash back on all purchases'
        });
    }
    
    // Default recommendation if no specific match
    if (recommendations.length === 0) {
        recommendations.push({
            name: 'General Purpose Card',
            description: 'Flexible rewards for everyday spending',
            annualFee: '$0',
            rewards: '1% cash back on all purchases'
        });
    }
    
    return recommendations;
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendation-cards');
    container.innerHTML = '';
    
    recommendations.forEach(rec => {
        const cardElement = document.createElement('div');
        cardElement.className = 'recommended-card';
        cardElement.innerHTML = `
            <h4>${rec.name}</h4>
            <p><strong>${rec.description}</strong></p>
            <p>Annual Fee: ${rec.annualFee}</p>
            <p>Rewards: ${rec.rewards}</p>
        `;
        container.appendChild(cardElement);
    });
}

// Smooth scroll functionality
function initializeSmoothScroll() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // CTA button scroll to calculator
    const mainCta = document.getElementById('main-cta');
    const calculatorCta = document.getElementById('full-calculator-cta');
    
    if (mainCta) {
        mainCta.addEventListener('click', () => {
            const calculatorSection = document.getElementById('calculator-section');
            if (calculatorSection) {
                calculatorSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    if (calculatorCta) {
        calculatorCta.addEventListener('click', () => {
            // Track event for analytics
            if (window.ldManager) {
                window.ldManager.trackEvent('calculator-cta-clicked', {
                    monthlySpending: document.getElementById('monthly-spending').value,
                    creditScore: document.getElementById('credit-score').value,
                    currentCards: document.getElementById('current-cards').value
                });
            }
            alert('Full calculator feature coming soon!');
        });
    }
}

// Event tracking for analytics
function initializeEventTracking() {
    // Track form interactions
    const formInputs = document.querySelectorAll('#calculator-section input, #calculator-section select');
    formInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (window.ldManager) {
                window.ldManager.trackEvent('calculator-input-changed', {
                    field: input.id,
                    value: input.value
                });
            }
        });
    });

    // Track feature card interactions
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            if (window.ldManager) {
                window.ldManager.trackEvent('feature-card-clicked', {
                    feature: card.id
                });
            }
        });
    });
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Add loading states and animations
function addLoadingStates() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1000);
        });
    });
}

// Initialize loading states when DOM is ready
document.addEventListener('DOMContentLoaded', addLoadingStates);
