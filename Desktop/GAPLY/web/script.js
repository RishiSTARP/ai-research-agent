// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:8080' : window.location.origin;

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTabs();
    initializeScrollEffects();
    initializeAnimations();
});

// Navigation
function initializeNavigation() {
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

// Tab System
function initializeTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    // Remove active class from all buttons and panels
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Add active class to clicked button and corresponding panel
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Scroll Effects
function initializeScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Smooth scrolling for anchor links
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
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .step, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// API Functions
async function testParaphrase() {
    const text = document.getElementById('paraphrase-text').value;
    const resultDiv = document.getElementById('paraphrase-result');
    
    if (!text.trim()) {
        showError(resultDiv, 'Please enter some text to paraphrase.');
        return;
    }
    
    showLoading(resultDiv);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/grammar-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                user_id: 'demo-user'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display real API response
        let resultText = '';
        if (data.analysis && data.analysis.corrected_issues) {
            resultText = `Analysis completed! Improvement Score: ${data.improvement_score}%\n\n`;
            resultText += `Suggestions:\n${data.suggestions.map(s => `• ${s}`).join('\n')}`;
        } else if (data.enhanced_text) {
            resultText = `Paraphrased text: ${data.enhanced_text}`;
        } else if (data.corrected_text) {
            resultText = `Corrected text: ${data.corrected_text}`;
        } else {
            resultText = `Analysis completed! Score: ${data.improvement_score || 'N/A'}%\n\nSuggestions: ${data.suggestions ? data.suggestions.join(', ') : 'No specific suggestions'}`;
        }
        
        showSuccess(resultDiv, resultText);
    } catch (error) {
        console.error('Paraphrase error:', error);
        showError(resultDiv, `Error: ${error.message}. Please try again.`);
    }
}

async function testSearch() {
    const query = document.getElementById('search-query').value;
    const resultDiv = document.getElementById('search-result');
    
    if (!query.trim()) {
        showError(resultDiv, 'Please enter a search query.');
        return;
    }
    
    showLoading(resultDiv);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v2/search/papers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: {
                    keywords: [query],
                    concepts: [],
                    max_results: 5
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        showSearchResults(resultDiv, data);
    } catch (error) {
        console.error('Search error:', error);
        showError(resultDiv, `Error: ${error.message}. Please try again.`);
    }
}

async function testJournalMatch() {
    const title = document.getElementById('journal-title').value;
    const abstract = document.getElementById('journal-abstract').value;
    const resultDiv = document.getElementById('journal-result');
    
    if (!title.trim() || !abstract.trim()) {
        showError(resultDiv, 'Please enter both title and abstract.');
        return;
    }
    
    showLoading(resultDiv);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v2/journals/match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                research_details: {
                    title: title,
                    abstract: abstract,
                    keywords: []
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        showJournalResults(resultDiv, data);
    } catch (error) {
        console.error('Journal match error:', error);
        showError(resultDiv, `Error: ${error.message}. Please try again.`);
    }
}

// UI Helper Functions
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div> Processing...';
    element.className = 'demo-result';
}

function showSuccess(element, message) {
    element.innerHTML = `<div class="success">✓ ${message}</div>`;
    element.className = 'demo-result success';
}

function showError(element, message) {
    element.innerHTML = `<div class="error">✗ ${message}</div>`;
    element.className = 'demo-result error';
}

function showSearchResults(element, data) {
    if (data.papers && data.papers.length > 0) {
        let html = `<h4>Found ${data.papers.length} Papers:</h4>`;
        html += `<p><strong>Search Summary:</strong> ${data.results_summary.total_papers_found} papers found in ${data.results_summary.processing_time.toFixed(2)}s</p>`;
        html += '<ul>';
        data.papers.slice(0, 5).forEach(paper => {
            html += `<li><strong>${paper.title}</strong><br>
                     <small>Authors: ${paper.authors ? paper.authors.join(', ') : 'Unknown'}</small><br>
                     <small>Journal: ${paper.journal_name || 'Unknown'} (${paper.publication_year || 'Unknown year'})</small><br>
                     <small>DOI: ${paper.doi || 'N/A'} | Citations: ${paper.citation_count || 0}</small><br>
                     <small>Abstract: ${paper.abstract ? paper.abstract.substring(0, 200) + '...' : 'No abstract available'}</small></li><br>`;
        });
        html += '</ul>';
        element.innerHTML = html;
    } else {
        showError(element, 'No papers found for your query.');
    }
    element.className = 'demo-result';
}


function showJournalResults(element, data) {
    if (data.recommended_journals && data.recommended_journals.length > 0) {
        let html = `<h4>Recommended Journals (${data.total_matches} total matches):</h4>`;
        html += '<ul>';
        data.recommended_journals.slice(0, 5).forEach(journal => {
            const matchScore = journal.match_analysis ? (journal.match_analysis.overall_score * 100).toFixed(1) : 'N/A';
            const impactFactor = journal.journal.impact_factor || 'N/A';
            const quartile = journal.journal.quartile || 'N/A';
            const fee = journal.journal.publication_fee_usd || 0;
            
            html += `<li><strong>${journal.journal.name}</strong><br>
                     <small>Publisher: ${journal.journal.publisher || 'Unknown'}</small><br>
                     <small>Match Score: ${matchScore}% | Impact Factor: ${impactFactor} | Quartile: ${quartile}</small><br>
                     <small>Publication Fee: $${fee} | Review Time: ${journal.journal.average_review_time_days || 'N/A'} days</small><br>
                     <small>Reasons: ${journal.recommendation_reasons ? journal.recommendation_reasons.join(', ') : 'High relevance'}</small></li><br>`;
        });
        html += '</ul>';
        element.innerHTML = html;
    } else {
        showError(element, 'No suitable journals found for your research.');
    }
    element.className = 'demo-result';
}


// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scrolling behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add loading states to buttons
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.textContent.includes('Get Started') || this.textContent.includes('Start Pro Trial')) {
            e.preventDefault();
            this.innerHTML = '<div class="loading"></div> Redirecting...';
            setTimeout(() => {
                this.innerHTML = 'Redirecting...';
                // In a real app, this would redirect to signup/login
                alert('This would redirect to the signup page in a real application.');
            }, 1000);
        }
    });
});

// Add hover effects to cards
document.querySelectorAll('.feature-card, .pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add click effects to buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Console welcome message
console.log(`
🚀 Welcome to GAPLY - AI Research Agent
📚 Built with modern web technologies
🔗 API Base URL: ${API_BASE_URL}
💡 This is a demo interface for our AI-powered research tools
`);
