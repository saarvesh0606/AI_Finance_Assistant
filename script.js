// // QuanTara Finance Dashboard JavaScript

// // Configuration
// const API_BASE = 'http://127.0.0.1:5000';

// // Global variables
// let revenueChart = null;
// let stockChart = null;
// let corpSelectedFile = null;

// // DOM utility functions
// const $ = (id) => document.getElementById(id);
// const show = (el) => el.classList.remove('hidden');
// const hide = (el) => el.classList.add('hidden');
// const addClass = (el, className) => el.classList.add(className);
// const removeClass = (el, className) => el.classList.remove(className);

// // Loading spinner utilities
// const showSpinner = () => show($('loadingSpinner'));
// const hideSpinner = () => hide($('loadingSpinner'));

// // Value formatting utilities
// const formatCurrency = (value, currency = '$') => {
//     if (value == null || value === '—') return '—';
//     if (typeof value === 'string') return value;
//     return `${currency}${Number(value).toLocaleString()}`;
// };

// const formatPercentage = (value) => {
//     if (value == null || value === '—') return '—';
//     if (typeof value === 'string') return value;
//     return `${Number(value).toFixed(2)}%`;
// };

// const valOrDash = (val) => val != null ? val : '—';

// // File utilities
// const fileIsCSV = (file) => file && /\.csv$/i.test(file.name);

// const getCurrency = (ticker) => {
//     const t = (ticker || '').toUpperCase();
//     if (t.endsWith('.NS') || t.endsWith('.BO')) return '₹';
//     if (t.endsWith('.L')) return '£';
//     if (t.endsWith('.TO')) return 'C$';
//     return '$';
// };

// // Animation utilities
// const fadeIn = (element) => {
//     element.classList.add('fade-in');
//     setTimeout(() => element.classList.remove('fade-in'), 500);
// };

// const addGlowEffect = (element) => {
//     element.classList.add('glow-effect');
//     setTimeout(() => element.classList.remove('glow-effect'), 300);
// };

// // Tab Management System
// class TabManager {
//     constructor() {
//         this.activeTab = 'corporate';
//         this.init();
//     }

//     init() {
//         // Get all tab buttons and panels
//         this.tabButtons = document.querySelectorAll('.tab');
//         this.panels = {
//             corporate: $('panel-corporate'),
//             news: $('panel-news'),
//             stock: $('panel-stock'),
//             industry: $('panel-industry'),
//             summarization: $('panel-summarization'),
//             whatif: $('panel-whatif'),
//             market: $('panel-market')
//         };

//         // Add event listeners to tab buttons
//         this.tabButtons.forEach(button => {
//             button.addEventListener('click', () => {
//                 const tabName = button.dataset.tab;
//                 this.switchTab(tabName);
//                 addGlowEffect(button);
//             });
//         });
//     }

//     switchTab(tabName) {
//         if (!this.panels[tabName]) return;

//         // Hide all panels
//         Object.values(this.panels).forEach(panel => {
//             panel.classList.remove('panel-active');
//             panel.classList.add('hidden');
//         });

//         // Remove active class from all tabs
//         this.tabButtons.forEach(button => {
//             button.classList.remove('tab-active');
//         });

//         // Show selected panel and activate tab
//         const selectedPanel = this.panels[tabName];
//         const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        
//         selectedPanel.classList.remove('hidden');
//         selectedPanel.classList.add('panel-active');
//         selectedTab.classList.add('tab-active');

//         this.activeTab = tabName;
//         fadeIn(selectedPanel);

//         // Smooth scroll to top
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
// }

// // API Status Manager
// class ApiStatusManager {
//     constructor() {
//         this.badge = $('apiStatusBadge');
//         this.checkStatus();
//         this.startPeriodicCheck();
//     }

//     async checkStatus() {
//         try {
//             const response = await fetch(`${API_BASE}/api-status`, {
//                 method: 'GET',
//                 timeout: 5000
//             });
            
//             if (response.ok) {
//                 const data = await response.json();
//                 this.updateStatus(data.status === 'connected' ? 'connected' : 'degraded');
//             } else {
//                 this.updateStatus('degraded');
//             }
//         } catch (error) {
//             this.updateStatus('offline');
//         }
//     }

//     updateStatus(status) {
//         this.badge.className = 'status-badge ' + status;
        
//         switch (status) {
//             case 'connected':
//                 this.badge.textContent = 'API: Connected';
//                 break;
//             case 'degraded':
//                 this.badge.textContent = 'API: Degraded';
//                 break;
//             case 'offline':
//                 this.badge.textContent = 'API: Offline';
//                 break;
//         }
//     }

//     startPeriodicCheck() {
//         setInterval(() => this.checkStatus(), 30000); // Check every 30 seconds
//     }
// }

// // Corporate Analyzer Manager
// class CorporateAnalyzer {
//     constructor() {
//         this.init();
//     }

//     init() {
//         $('corpFile').addEventListener('change', this.handleFileChange.bind(this));
//         $('btnParseCompanies').addEventListener('click', this.parseCompanies.bind(this));
//         $('btnAnalyzeCorporate').addEventListener('click', this.analyzeCorporate.bind(this));
//     }

//     handleFileChange(event) {
//         corpSelectedFile = event.target.files[0] || null;
//         const parseBtn = $('btnParseCompanies');
        
//         if (fileIsCSV(corpSelectedFile)) {
//             parseBtn.disabled = false;
//             parseBtn.style.opacity = '1';
//         } else {
//             parseBtn.disabled = true;
//             parseBtn.style.opacity = '0.5';
//             $('corpCompany').innerHTML = '<option value="">Select Company (CSV only)</option>';
//         }
//     }

//     async parseCompanies() {
//         if (!corpSelectedFile || !fileIsCSV(corpSelectedFile)) {
//             alert('Please select a CSV file first.');
//             return;
//         }

//         const btn = $('btnParseCompanies');
//         const originalText = btn.textContent;
//         btn.textContent = 'Loading...';
//         btn.disabled = true;

//         try {
//             const formData = new FormData();
//             formData.append('file', corpSelectedFile);

//             const response = await fetch(`${API_BASE}/parse-csv-companies`, {
//                 method: 'POST',
//                 body: formData
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || 'Failed to parse companies');
//             }

//             // Populate company dropdown
//             const select = $('corpCompany');
//             const options = ['<option value="">Select Company</option>'];
//             (data.companies || []).forEach(company => {
//                 options.push(`<option value="${company}">${company}</option>`);
//             });
//             select.innerHTML = options.join('');

//         } catch (error) {
//             alert(`Error: ${error.message}`);
//         } finally {
//             btn.textContent = originalText;
//             btn.disabled = false;
//         }
//     }

//     async analyzeCorporate() {
//         if (!corpSelectedFile) {
//             alert('Please select a file to analyze.');
//             return;
//         }

//         const btn = $('btnAnalyzeCorporate');
//         const originalText = btn.textContent;
//         btn.textContent = 'Analyzing...';
//         btn.disabled = true;

//         showSpinner();

//         try {
//             const formData = new FormData();
//             formData.append('file', corpSelectedFile);

//             const selectedCompany = $('corpCompany').value;
//             if (selectedCompany) {
//                 formData.append('company', selectedCompany);
//             }

//             const response = await fetch(`${API_BASE}/analyze-corporate`, {
//                 method: 'POST',
//                 body: formData
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || 'Analysis failed');
//             }

//             this.displayResults(data);

//         } catch (error) {
//             alert(`Error: ${error.message}`);
//         } finally {
//             btn.textContent = originalText;
//             btn.disabled = false;
//             hideSpinner();
//         }
//     }

//     displayResults(data) {
//         // Update summary
//         $('corpSummary').textContent = data.summary || 'Analysis completed successfully.';

//         // Update KPIs
//         const kpis = data.kpis || {};
//         $('kpiRevenue').textContent = formatCurrency(kpis["Total Revenue"]);
//         $('kpiIncome').textContent = formatCurrency(kpis["Net Income"]);
//         $('kpiEPS').textContent = valOrDash(kpis["EPS"]);
//         $('kpiOM').textContent = formatPercentage(kpis["Operating Margin"]);

//         // Update chart
//         this.updateRevenueChart(data.chartData);

//         // Update risks and opportunities
//         this.updateInsightLists(data.risks, data.opportunities);

//         // Update insight card
//         const insightCard = data.insightCard || {};
//         $('corpInsightTitle').textContent = insightCard.title || '';
//         $('corpInsightExp').textContent = insightCard.explanation || '';

//         // Show results with animation
//         const resultContainer = $('corpResult');
//         show(resultContainer);
//         fadeIn(resultContainer);
//     }

//     updateRevenueChart(chartData) {
//         const chart = chartData || {};
//         const labels = chart.labels || [];
//         const revenueData = chart.revenueData || [];

//         const ctx = $('revenueChart').getContext('2d');

//         // Destroy existing chart
//         if (revenueChart) {
//             revenueChart.destroy();
//         }

//         revenueChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels,
//                 datasets: [{
//                     label: 'Revenue',
//                     data: revenueData,
//                     borderColor: '#8B7EC8',
//                     backgroundColor: 'rgba(139, 126, 200, 0.1)',
//                     fill: true,
//                     tension: 0.4,
//                     pointBackgroundColor: '#A594D1',
//                     pointBorderColor: '#8B7EC8',
//                     pointHoverBackgroundColor: '#A594D1',
//                     pointHoverBorderColor: '#ffffff'
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         labels: {
//                             color: '#b4b4b4'
//                         }
//                     },
//                     tooltip: {
//                         mode: 'index',
//                         intersect: false,
//                         backgroundColor: 'rgba(26, 26, 26, 0.95)',
//                         titleColor: '#ffffff',
//                         bodyColor: '#b4b4b4',
//                         borderColor: '#8B7EC8',
//                         borderWidth: 1
//                     }
//                 },
//                 scales: {
//                     x: {
//                         ticks: { color: '#666666' },
//                         grid: { color: 'rgba(139, 126, 200, 0.1)' }
//                     },
//                     y: {
//                         ticks: { color: '#666666' },
//                         grid: { color: 'rgba(139, 126, 200, 0.1)' }
//                     }
//                 }
//             }
//         });
//     }

//     updateInsightLists(risks, opportunities) {
//         const risksList = $('corpRisks');
//         const oppsList = $('corpOpps');

//         // Convert markdown lists to HTML
//         const convertToHTML = (mdText = '') => {
//             return mdText.split('\n')
//                 .filter(line => line.trim().startsWith('-'))
//                 .map(line => `<li>${line.replace(/^-\s*/, '')}</li>`)
//                 .join('');
//         };

//         risksList.innerHTML = convertToHTML(risks);
//         oppsList.innerHTML = convertToHTML(opportunities);
//     }
// }

// // News Analyzer Manager
// class NewsAnalyzer {
//     constructor() {
//         this.init();
//     }

//     init() {
//         $('btnFetchNews').addEventListener('click', this.fetchNews.bind(this));
//     }

//     async fetchNews() {
//         const company = $('newsCompany').value.trim();
//         if (!company) {
//             alert('Please enter a company name.');
//             return;
//         }

//         const resultContainer = $('newsResult');
//         resultContainer.innerHTML = '<div class="loading-text">Fetching news...</div>';

//         try {
//             const response = await fetch(`${API_BASE}/live-news`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ company })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || 'Failed to fetch news');
//             }

//             this.displayNewsResults(data);

//         } catch (error) {
//             resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
//         }
//     }

//     displayNewsResults(data) {
//         const sentiment = data.sentiment || 'Neutral';
//         const sentimentClass = sentiment === 'Positive' ? 'success' :
//                               sentiment === 'Negative' ? 'error' : 'info';
        
//         const articles = (data.articles || []).map(article => `
//             <div class="news-article">
//                 <a href="${article.url}" target="_blank" class="article-link">
//                     ${article.title || 'Untitled'}
//                 </a>
//                 <div class="article-meta">
//                     <span class="article-source">${article.source || 'Unknown'}</span>
//                     <span class="article-date">${new Date(article.publishedAt).toLocaleDateString()}</span>
//                 </div>
//             </div>
//         `).join('');

//         const resultContainer = $('newsResult');
//         resultContainer.innerHTML = `
//             <div class="sentiment-analysis">
//                 <div class="sentiment-badge ${sentimentClass}">${sentiment}</div>
//                 <div class="sentiment-summary">${data.summary || ''}</div>
//             </div>
//             <div class="articles-section">
//                 <h3 class="section-title">Recent Articles</h3>
//                 <div class="articles-list">${articles}</div>
//             </div>
//         `;

//         fadeIn(resultContainer);
//     }
// }

// // Stock Analyzer Manager  
// class StockAnalyzer {
//     constructor() {
//         this.init();
//     }

//     init() {
//         $('btnStockAnalyze').addEventListener('click', this.analyzeStock.bind(this));
//     }

//     async analyzeStock() {
//         const ticker = $('stockTicker').value.trim();
//         const period = $('stockPeriod').value;
//         const interval = $('stockInterval').value;
//         const question = $('stockQuestion').value.trim();

//         if (!ticker) {
//             alert('Please enter a stock ticker.');
//             return;
//         }

//         const resultContainer = $('stockResult');
//         resultContainer.innerHTML = '<div class="loading-text">Analyzing stock data...</div>';
//         show(resultContainer);

//         try {
//             const response = await fetch(`${API_BASE}/stock-analysis`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ ticker, period, interval, question })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || 'Analysis failed');
//             }

//             this.displayStockResults(data);

//         } catch (error) {
//             resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
//         }
//     }

//     displayStockResults(data) {
//         const metrics = data.metrics || {};
//         const forecast = data.forecast || [];
//         const currency = getCurrency(data.ticker);

//         // Generate forecast table
//         const forecastTable = forecast.map(item => `
//             <tr>
//                 <td>${item.day}</td>
//                 <td class="text-right">${currency}${item.price}</td>
//                 <td class="text-right">${currency}${item.lower}</td>
//                 <td class="text-right">${currency}${item.upper}</td>
//             </tr>
//         `).join('');

//         const resultContainer = $('stockResult');
//         resultContainer.innerHTML = `
//             ${data.qa ? `
//                 <div class="qa-section">
//                     <h3 class="section-title">Analysis Response</h3>
//                     <div class="qa-response">${data.qa}</div>
//                 </div>
//             ` : ''}
            
//             <div class="stock-metrics-grid">
//                 <div class="metric-card">
//                     <div class="metric-label">Current Price</div>
//                     <div class="metric-value">${currency}${valOrDash(metrics.price)}</div>
//                     <div class="metric-change ${(metrics.changePct || 0) >= 0 ? 'positive' : 'negative'}">
//                         ${formatPercentage(metrics.changePct)}
//                     </div>
//                 </div>
//                 <div class="metric-card">
//                     <div class="metric-label">RSI (14)</div>
//                     <div class="metric-value">${valOrDash(metrics.RSI14)}</div>
//                     <div class="rsi-indicator ${this.getRSIClass(metrics.RSI14)}">${this.getRSIStatus(metrics.RSI14)}</div>
//                 </div>
//                 <div class="metric-card">
//                     <div class="metric-label">SMA 20</div>
//                     <div class="metric-value">${currency}${valOrDash(metrics.SMA20)}</div>
//                 </div>
//                 <div class="metric-card">
//                     <div class="metric-label">SMA 50</div>
//                     <div class="metric-value">${currency}${valOrDash(metrics.SMA50)}</div>
//                 </div>
//             </div>

//             <div class="chart-container">
//                 <h3 class="section-title">Price History</h3>
//                 <canvas id="stockChart"></canvas>
//             </div>

//             <div class="forecast-section">
//                 <h3 class="section-title">Price Forecast (Next 5 Sessions)</h3>
//                 <table class="forecast-table">
//                     <thead>
//                         <tr>
//                             <th>Day</th>
//                             <th>Price</th>
//                             <th>Lower Bound</th>
//                             <th>Upper Bound</th>
//                         </tr>
//                     </thead>
//                     <tbody>${forecastTable}</tbody>
//                 </table>
//             </div>
//         `;

//         // Update stock chart
//         this.updateStockChart(data.history);

//         fadeIn(resultContainer);
//     }

//     getRSIClass(rsi) {
//         if (rsi >= 70) return 'overbought';
//         if (rsi <= 30) return 'oversold';
//         return 'neutral';
//     }

//     getRSIStatus(rsi) {
//         if (rsi >= 70) return 'Overbought';
//         if (rsi <= 30) return 'Oversold';
//         return 'Neutral';
//     }

//     updateStockChart(historyData) {
//         const history = historyData || {};
//         const labels = history.labels || [];
//         const closeData = history.close || [];

//         const ctx = $('stockChart').getContext('2d');

//         if (stockChart) {
//             stockChart.destroy();
//         }

//         stockChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels,
//                 datasets: [{
//                     label: 'Close Price',
//                     data: closeData,
//                     borderColor: '#8B7EC8',
//                     backgroundColor: 'rgba(139, 126, 200, 0.1)',
//                     fill: true,
//                     tension: 0.2,
//                     pointRadius: 1,
//                     pointHoverRadius: 4
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: { display: false },
//                     tooltip: {
//                         backgroundColor: 'rgba(26, 26, 26, 0.95)',
//                         titleColor: '#ffffff',
//                         bodyColor: '#b4b4b4',
//                         borderColor: '#8B7EC8',
//                         borderWidth: 1
//                     }
//                 },
//                 scales: {
//                     x: {
//                         ticks: { color: '#666666' },
//                         grid: { color: 'rgba(139, 126, 200, 0.1)' }
//                     },
//                     y: {
//                         ticks: { color: '#666666' },
//                         grid: { color: 'rgba(139, 126, 200, 0.1)' }
//                     }
//                 }
//             }
//         });
//     }
// }

// // Industry Analyzer Manager
// class IndustryAnalyzer {
//     constructor() {
//         this.init();
//     }

//     init() {
//         $('btnIndustryAnalyze').addEventListener('click', this.analyzeIndustry.bind(this));
//     }

//     async analyzeIndustry() {
//         const industry = $('industryName').value.trim();
//         const inputs = $('industryInputs').value.trim();

//         if (!industry) {
//             alert('Please enter an industry name.');
//             return;
//         }

//         const resultContainer = $('industryResult');
//         resultContainer.innerHTML = '<div class="loading-text">Analyzing industry...</div>';

//         try {
//             const response = await fetch(`${API_BASE}/industry-analyze`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ industry, inputs })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || 'Analysis failed');
//             }

//             this.displayIndustryResults(data);

//         } catch (error) {
//             resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
//         }
//     }

//     displayIndustryResults(data) {
//         const resultContainer = $('industryResult');
        
//         const createList = (items = []) => {
//             return items.map(item => `<li>${item}</li>`).join('');
//         };

//         resultContainer.innerHTML = `
//             <div class="industry-analysis">
//                 <div class="analysis-section">
//                     <h3 class="section-title">Overview</h3>
//                     <p class="analysis-text">${data.overview || 'No overview available.'}</p>
//                 </div>
                
//                 <div class="analysis-section">
//                     <h3 class="section-title">Key Drivers</h3>
//                     <ul class="analysis-list">${createList(data.drivers)}</ul>
//                 </div>
                
//                 <div class="analysis-section">
//                     <h3 class="section-title">Risk Factors</h3>
//                     <ul class="analysis-list risks">${createList(data.risks)}</ul>
//                 </div>
                
//                 <div class="analysis-section">
//                     <h3 class="section-title">Outlook</h3>
//                     <p class="analysis-text">${data.outlook || 'No outlook available.'}</p>
//                 </div>
                
//                 <div class="analysis-section">
//                     <h3 class="section-title">Companies to Watch</h3>
//                     <ul class="analysis-list watchlist">${createList(data.watchlist)}</ul>
//                 </div>
//             </div>
//         `;

//         fadeIn(resultContainer);
//     }
// }

// // Summarization Manager
// // class SummarizationManager {
// //     constructor() {
// //         this.init();
// //     }

// //     init() {
// //         $('btnSummarizeFile').addEventListener('click', this.summarizeFile.bind(this));
// //         $('btnSummarizeText').addEventListener('click', this.summarizeText.bind(this));
// //     }

// //     async summarizeFile() {
// //         const file = $('sumFile').files[0];
// //         const style = $('sumStyle').value;

// //         if (!file) {
// //             alert('Please select a file to summarize.');
// //             return;
// //         }

// //         const resultContainer = $('sumResult');
// //         resultContainer.innerHTML = '<div class="loading-text">Summarizing file...</div>';

// //         try {
// //             const formData = new FormData();
// //             formData.append('file', file);
// //             formData.append('style', style);

// //             const response = await fetch(`${API_BASE}/summarize`, {
// //                 method: 'POST',
// //                 body: formData
// //             });

// //             const data = await response.json();

// //             if (!response.ok) {
// //                 throw new Error(data.error || 'Summarization failed');
// //             }

// //             resultContainer.innerHTML = `
// //                 <div class="summary-result">
// //                     <h3 class="section-title">Summary</h3>
// //                     <div class="summary-content">${data.summary}</div>
// //                 </div>
// //             `;

// //             fadeIn(resultContainer);

// //         } catch (error) {
// //             resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
// //         }
// //     }

// //     async summarizeText() {
// //         const text = $('sumText').value.trim();
// //         const style = $('sumStyle').value;

// //         if (!text) {
// //             alert('Please enter text to summarize.');
// //             return;
// //         }

// //         const resultContainer = $('sumResult');
// //         resultContainer.innerHTML = '<div class="loading-text">Summarizing text...</div>';

// //         try {
// //             const response = await fetch(`${API_BASE}/summarize`, {
// //                 method: 'POST',
// //                 headers: { 'Content-Type': 'application/json' },
// //                 body: JSON.stringify({ text, style })
// //             });

// //             const data = await response.json();

// //             if (!response.ok) {
// //                 throw new Error(data.error || 'Summarization failed');
// //             }

// //             resultContainer.innerHTML = `
// //                 <div class="summary-result">
// //                     <h3 class="section-title">Summary</h3>
// //                     <div class="summary-content">${data.summary}</div>
// //                 </div>
// //             `;

// //             fadeIn(resultContainer);

// //         } catch (error) {
// //             resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
// //         }
// //     }
// // }

// class SummarizationManager {
//     constructor() {
//         this.init();
//     }

//     init() {
//         $('btnSummarizeFile').addEventListener('click', this.summarizeFile.bind(this));
//         $('btnSummarizeText').addEventListener('click', this.summarizeText.bind(this));
//     }

//     /**
//      * This function takes the raw text from the server and formats it into pretty HTML.
//      * @param {string} summaryText The raw text string from the API response.
//      * @returns {string} An HTML string formatted as a list with bold headings.
//      */
//     formatSummary(summaryText) {
//         // Splits the text into points based on the "* **" pattern
//         const points = summaryText.split('* **').filter(point => point.trim() !== '');

//         if (points.length === 0 && summaryText.length > 0) {
//             return `<p>${summaryText}</p>`; // Fallback for plain paragraph text
//         }

//         const listItems = points.map(point => {
//             const titleEndIndex = point.indexOf('**');
//             if (titleEndIndex !== -1) {
//                 // Extracts the heading and the description text
//                 const title = point.substring(0, titleEndIndex).trim();
//                 const description = point.substring(titleEndIndex + 2).replace(/^:\s*/, '').trim();
                
//                 // Creates a list item with a bolded heading
//                 return `<li><strong>${title}:</strong> ${description}</li>`;
//             }
//             return `<li>${point.trim()}</li>`; // Fallback for items without a heading
//         }).join('');

//         return `<ul>${listItems}</ul>`;
//     }

//     async summarizeFile() {
//         const file = $('sumFile').files[0];
//         const style = $('sumStyle').value;

//         if (!file) {
//             alert('Please select a file to summarize.');
//             return;
//         }

//         const resultContainer = $('sumResult');
//         resultContainer.innerHTML = '<div class="loading-text">Summarizing file...</div>';

//         try {
//             const formData = new FormData();
//             formData.append('file', file);
//             formData.append('style', style);

//             const response = await fetch(`${API_BASE}/summarize`, {
//                 method: 'POST',
//                 body: formData
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(errorText || `Request failed with status ${response.status}`);
//             }

//             const summaryText = await response.text();
            
//             // ✨ Use the new function here to format the text before displaying it
//             const formattedSummary = this.formatSummary(summaryText);

//             resultContainer.innerHTML = `
//                 <div class="summary-result">
//                     <h3 class="section-title">Summary</h3>
//                     <div class="summary-content">${formattedSummary}</div>
//                 </div>
//             `;

//             // fadeIn(resultContainer); // Uncomment if you have this function
//         } catch (error) {
//             resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
//         }
//     }

//     async summarizeText() {
//         const text = $('sumText').value.trim();
//         const style = $('sumStyle').value;

//         if (!text) {
//             alert('Please enter text to summarize.');
//             return;
//         }

//         const resultContainer = $('sumResult');
//         resultContainer.innerHTML = '<div class="loading-text">Summarizing text...</div>';

//         try {
//             const response = await fetch(`${API_BASE}/summarize`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ text, style })
//             });
            
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(errorText || `Request failed with status ${response.status}`);
//             }

//             const summaryText = await response.text();

//             // ✨ Use the new function here to format the text before displaying it
//             const formattedSummary = this.formatSummary(summaryText);

//             resultContainer.innerHTML = `
//                 <div class="summary-result">
//                     <h3 class="section-title">Summary</h3>
//                     <div class="summary-content">${formattedSummary}</div>
//                 </div>
//             `;

//             // fadeIn(resultContainer); // Uncomment if you have this function
//         } catch (error) {
//             resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
//         }
//     }
// }

// // Add this at the end of your script to ensure it runs after the page loads
// document.addEventListener('DOMContentLoaded', () => {
//     new SummarizationManager();
// });


// // What-If Analyzer Manager
// 

// // Market Intelligence Manager
// // class MarketIntelligenceManager {
// //     constructor() {
// //         this.init();
// //     }

// //     init() {
// //         $('btnAnalyzeMarket').addEventListener('click', this.analyzeMarket.bind(this));
// //     }

// //     async analyzeMarket() {
// //         const files = $('miFiles').files;

// //         if (!files || files.length === 0) {
// //             alert('Please select at least one file to analyze.');
// //             return;
// //         }

// //         const resultContainer = $('miResult');
// //         resultContainer.innerHTML = '<div class="loading-text">Analyzing market intelligence...</div>';

// //         try {
// //             const formData = new FormData();
// //             for (const file of files) {
// //                 formData.append('files', file);
// //             }

// //             const response = await fetch(`${API_BASE}/analyze-market`, {
// //                 method: 'POST',
// //                 body: formData
// //             });

// //             const data = await response.json();

// //             if (!response.ok) {
// //                 throw new Error(data.error || 'Market analysis failed');
// //             }

// //             resultContainer.innerHTML = `
// //                 <div class="market-intelligence">
// //                     <h3 class="section-title">Market Intelligence Briefing</h3>
// //                     <div class="briefing-content">${data.briefing}</div>
// //                 </div>
// //             `;

// //             fadeIn(resultContainer);

// //         } catch (error) {
// //             resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
// //         }
// //     }
// // }

// class MarketIntelligenceManager {
//     constructor() {
//         // --- Make sure these element IDs match your HTML ---
//         this.btnAnalyze = document.getElementById('btnAnalyzeMarket');
//         this.filesInput = document.getElementById('miFiles');
//         this.resultContainer = document.getElementById('miResult');
//         // --- Set your actual backend server address here ---
//         this.apiBase = 'http://127.0.0.1:5000'; // Example

//         this.init();
//     }

//     init() {
//         this.btnAnalyze.addEventListener('click', this.analyzeMarket.bind(this));
//     }

//     /**
//      * UPDATED: A more robust function to parse the briefing text.
//      * This version uses a Regular Expression to accurately capture both titles and descriptions.
//      * @param {string} briefingText The raw text from the server.
//      * @returns {string} The formatted HTML string.
//      */
//     formatBriefing(briefingText) {
//         // This regex looks for the pattern: **Title:**Description, and stops at the next **
//         const regex = /\*\*(.*?):\*\*(.*?)(?=\s*\*\*|$)/gs;
        
//         let itemsHtml = '';
//         let match;

//         // Loop through every match found in the text
//         while ((match = regex.exec(briefingText)) !== null) {
//             // match[1] is the title
//             // match[2] is the description
//             const title = match[1].trim();
//             const description = match[2].replace(/\*/g, '').trim(); // Clean up stray asterisks

//             // Only create an item if both the title and description have content
//             if (title && description) {
//                 itemsHtml += `
//                     <div class="briefing-item">
//                         <div class="briefing-title">${title}</div>
//                         <div class="briefing-description">${description}</div>
//                     </div>
//                 `;
//             }
//         }

//         // If the regex finds no matches, fall back to a simple display
//         // to prevent a blank output.
//         if (itemsHtml === '') {
//             return `<div class="briefing-description">${briefingText.replace(/[*#]/g, '')}</div>`;
//         }
        
//         return itemsHtml;
//     }

//     async analyzeMarket() {
//         const files = this.filesInput.files;

//         if (!files || files.length === 0) {
//             alert('Please select at least one file to analyze.');
//             return;
//         }

//         this.resultContainer.innerHTML = '<div class="loading-text">Analyzing market intelligence...</div>';

//         try {
//             const formData = new FormData();
//             for (const file of files) {
//                 formData.append('files', file);
//             }

//             const response = await fetch(`${this.apiBase}/analyze-market`, {
//                 method: 'POST',
//                 body: formData
//             });
            
//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({ error: 'Market analysis failed with status ' + response.status }));
//                 throw new Error(errorData.error);
//             }

//             const data = await response.json();
            
//             // This now calls the new, more powerful formatting function
//             const formattedBriefing = this.formatBriefing(data.briefing);

//             this.resultContainer.innerHTML = `
//                 <div class="market-intelligence">
//                     <h3 class="section-title">Market Intelligence Briefing</h3>
//                     <div class="briefing-content">${formattedBriefing}</div>
//                 </div>
//             `;

//         } catch (error) {
//             this.resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
//         }
//     }
// }

// // Ensure the script runs after the page is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     new MarketIntelligenceManager();
// });

// // Application Initialization
// class QuanTaraApp {
//     constructor() {
//         this.init();
//     }

//     init() {
//         // Initialize all managers
//         this.tabManager = new TabManager();
//         this.apiStatusManager = new ApiStatusManager();
//         this.corporateAnalyzer = new CorporateAnalyzer();
//         this.newsAnalyzer = new NewsAnalyzer();
//         this.stockAnalyzer = new StockAnalyzer();
//         this.industryAnalyzer = new IndustryAnalyzer();
//         this.summarizationManager = new SummarizationManager();
//         this.whatIfAnalyzer = new WhatIfAnalyzer();
//         this.marketIntelligenceManager = new MarketIntelligenceManager();

//         // Add global event listeners
//         this.addGlobalListeners();

//         // Add custom styles for dynamic elements
//         this.addDynamicStyles();
//     }

//     addGlobalListeners() {
//         // Handle file input changes for better UX
//         document.addEventListener('change', (event) => {
//             if (event.target.type === 'file') {
//                 this.updateFileLabel(event.target);
//             }
//         });

//         // Handle form submissions
//         document.addEventListener('keydown', (event) => {
//             if (event.key === 'Enter' && event.ctrlKey) {
//                 const activeTab = this.tabManager.activeTab;
//                 this.handleKeyboardShortcut(activeTab);
//             }
//         });
//     }

//     updateFileLabel(input) {
//         const label = input.nextElementSibling;
//         if (label && label.classList.contains('file-label')) {
//             const fileCount = input.files.length;
//             if (fileCount > 0) {
//                 if (fileCount === 1) {
//                     label.innerHTML = `<span class="upload-icon">📄</span>${input.files[0].name}`;
//                 } else {
//                     label.innerHTML = `<span class="upload-icon">📁</span>${fileCount} files selected`;
//                 }
//                 label.style.color = '#8B7EC8';
//             }
//         }
//     }

//     handleKeyboardShortcut(activeTab) {
//         const shortcuts = {
//             'corporate': () => $('btnAnalyzeCorporate').click(),
//             'news': () => $('btnFetchNews').click(),
//             'stock': () => $('btnStockAnalyze').click(),
//             'industry': () => $('btnIndustryAnalyze').click(),
//             'summarization': () => $('btnSummarizeText').click(),
//             'whatif': () => $('btnWhatIf').click(),
//             'market': () => $('btnAnalyzeMarket').click()
//         };

//         if (shortcuts[activeTab]) {
//             shortcuts[activeTab]();
//         }
//     }

//     addDynamicStyles() {
//         const style = document.createElement('style');
//         style.textContent = `
//             .loading-text {
//                 color: #8B7EC8;
//                 text-align: center;
//                 padding: 20px;
//                 font-style: italic;
//             }
            
//             .error-message {
//                 background: rgba(239, 68, 68, 0.1);
//                 border: 1px solid rgba(239, 68, 68, 0.3);
//                 color: #ef4444;
//                 padding: 16px;
//                 border-radius: 8px;
//                 text-align: center;
//             }
            
//             .news-article {
//                 padding: 12px 0;
//                 border-bottom: 1px solid rgba(139, 126, 200, 0.1);
//             }
            
//             .article-link {
//                 color: #f3f3f3ff;
//                 text-decoration: none;
//                 font-weight: 500;
//             }
            
//             .article-link:hover {
//                 color: #A594D1;
//                 text-decoration: underline;
//             }
            
//             .article-meta {
//                 font-size: 12px;
//                 color: #666666;
//                 margin-top: 4px;
//             }
            
//             .sentiment-badge {
//                 display: inline-block;
//                 padding: 6px 12px;
//                 border-radius: 20px;
//                 font-size: 12px;
//                 font-weight: 600;
//                 text-transform: uppercase;
//             }
            
//             .sentiment-badge.success {
//                 background: rgba(34, 197, 94, 0.2);
//                 color: #22c55e;
//             }
            
//             .sentiment-badge.error {
//                 background: rgba(239, 68, 68, 0.2);
//                 color: #ef4444;
//             }
            
//             .sentiment-badge.info {
//                 background: rgba(59, 130, 246, 0.2);
//                 color: #3b82f6;
//             }
            
//             .stock-metrics-grid {
//                 display: grid;
//                 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//                 gap: 16px;
//                 margin: 20px 0;
//             }
            
//             .metric-card {
//                 background: var(--color-surface);
//                 border: 1px solid rgba(139, 126, 200, 0.2);
//                 border-radius: 12px;
//                 padding: 16px;
//                 text-align: center;
//             }
            
//             .metric-value {
//                 font-size: 24px;
//                 font-weight: 700;
//                 color: #8B7EC8;
//                 margin: 8px 0;
//             }
            
//             .metric-change.positive {
//                 color: #22c55e;
//             }
            
//             .metric-change.negative {
//                 color: #ef4444;
//             }
            
//             .rsi-indicator.overbought {
//                 color: #ef4444;
//             }
            
//             .rsi-indicator.oversold {
//                 color: #22c55e;
//             }
            
//             .rsi-indicator.neutral {
//                 color: #8B7EC8;
//             }
            
//             .forecast-table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-top: 16px;
//             }
            
//             .forecast-table th,
//             .forecast-table td {
//                 padding: 12px;
//                 border-bottom: 1px solid rgba(139, 126, 200, 0.1);
//                 text-align: left;
//             }
            
//             .forecast-table th {
//                 background: var(--color-surface);
//                 color: #8B7EC8;
//                 font-weight: 600;
//             }
            
//             .text-right {
//                 text-align: right;
//             }
            
//             .analysis-list {
//                 list-style: none;
//                 padding: 0;
//             }
            
//             .analysis-list li {
//                 padding: 8px 0;
//                 padding-left: 20px;
//                 position: relative;
//                 color: #b4b4b4;
//             }
            
//             .analysis-list li:before {
//                 content: "▶";
//                 color: #8B7EC8;
//                 position: absolute;
//                 left: 0;
//             }
            
//             .analysis-list.risks li:before {
//                 content: "⚠";
//                 color: #ef4444;
//             }
            
//             .analysis-list.watchlist li:before {
//                 content: "⭐";
//                 color: #fbbf24;
//             }
//         `;
//         document.head.appendChild(style);
//     }
// }

// // Initialize the application when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     new QuanTaraApp();
// });

// // Export for potential module use
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = QuanTaraApp;
// }

// QuanTara Finance Dashboard JavaScript

// Configuration
// Use same-origin in production (Render) and local dev. If you need to point to
// a different backend, set window.API_BASE before loading this script.
const API_BASE = window.API_BASE || '';

// --- Async Jobs helpers ---
async function fetchJson(url, options = {}) {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
}

async function waitForJob(jobId, { intervalMs = 1200, timeoutMs = 10 * 60 * 1000, onTick } = {}) {
    const start = Date.now();
    while (true) {
        const job = await fetchJson(`${API_BASE}/jobs/${jobId}`);
        if (onTick) onTick(job);
        if (job.status === 'succeeded') return job;
        if (job.status === 'failed') throw new Error(job.error || 'Job failed');
        if (Date.now() - start > timeoutMs) throw new Error('Timed out waiting for job');
        await new Promise(r => setTimeout(r, intervalMs));
    }
}

// Global variables
let revenueChart = null;
let stockChart = null;
let corpSelectedFile = null;

// DOM utility functions
const $ = (id) => document.getElementById(id);
const show = (el) => el.classList.remove('hidden');
const hide = (el) => el.classList.add('hidden');

// Loading spinner utilities
const showSpinner = () => show($('loadingSpinner'));
const hideSpinner = () => hide($('loadingSpinner'));

// Value formatting utilities
const formatCurrency = (value, currency = '$') => {
    if (value == null || value === '—') return '—';
    if (typeof value === 'string') return value;
    return `${currency}${Number(value).toLocaleString()}`;
};

const formatPercentage = (value) => {
    if (value == null || value === '—') return '—';
    if (typeof value === 'string') return value;
    return `${Number(value).toFixed(2)}%`;
};

const valOrDash = (val) => val != null ? val : '—';

// File utilities
const fileIsCSV = (file) => file && /\.csv$/i.test(file.name);

const getCurrency = (ticker) => {
    const t = (ticker || '').toUpperCase();
    if (t.endsWith('.NS') || t.endsWith('.BO')) return '₹';
    if (t.endsWith('.L')) return '£';
    if (t.endsWith('.TO')) return 'C$';
    return '$';
};

// Animation utilities
const fadeIn = (element) => {
    element.classList.add('fade-in');
    setTimeout(() => element.classList.remove('fade-in'), 500);
};

const addGlowEffect = (element) => {
    element.classList.add('glow-effect');
    setTimeout(() => element.classList.remove('glow-effect'), 300);
};

// --- Manager Classes ---

class TabManager {
    constructor() {
        this.activeTab = 'corporate';
        this.init();
    }

    init() {
        this.tabButtons = document.querySelectorAll('.tab');
        this.panels = {
            corporate: $('panel-corporate'),
            news: $('panel-news'),
            stock: $('panel-stock'),
            industry: $('panel-industry'),
            summarization: $('panel-summarization'),
            whatif: $('panel-whatif'),
            market: $('panel-market')
        };

        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                this.switchTab(tabName);
                addGlowEffect(button);
            });
        });
    }

    switchTab(tabName) {
        if (!this.panels[tabName]) return;

        Object.values(this.panels).forEach(panel => {
            panel.classList.remove('panel-active');
            panel.classList.add('hidden');
        });

        this.tabButtons.forEach(button => {
            button.classList.remove('tab-active');
        });

        const selectedPanel = this.panels[tabName];
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        
        selectedPanel.classList.remove('hidden');
        selectedPanel.classList.add('panel-active');
        selectedTab.classList.add('tab-active');

        this.activeTab = tabName;
        fadeIn(selectedPanel);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

class ApiStatusManager {
    constructor() {
        this.badge = $('apiStatusBadge');
        this.checkStatus();
        setInterval(() => this.checkStatus(), 30000); // Check every 30 seconds
    }

    async checkStatus() {
        try {
            const response = await fetch(`${API_BASE}/api-status`);
            if (response.ok) {
                const data = await response.json();
                this.updateStatus(data.status === 'connected' ? 'connected' : 'degraded');
            } else {
                this.updateStatus('degraded');
            }
        } catch (error) {
            this.updateStatus('offline');
        }
    }

    updateStatus(status) {
        this.badge.className = 'status-badge ' + status;
        const statusText = {
            connected: 'API: Connected',
            degraded: 'API: Degraded',
            offline: 'API: Offline'
        };
        this.badge.textContent = statusText[status] || 'API: Unknown';
    }
}

class CorporateAnalyzer {
    constructor() {
        this.init();
    }

    init() {
        $('corpFile').addEventListener('change', this.handleFileChange.bind(this));
        $('btnParseCompanies').addEventListener('click', this.parseCompanies.bind(this));
        $('btnAnalyzeCorporate').addEventListener('click', this.analyzeCorporate.bind(this));
    }

    handleFileChange(event) {
        corpSelectedFile = event.target.files[0] || null;
        const parseBtn = $('btnParseCompanies');
        const isCsv = fileIsCSV(corpSelectedFile);
        parseBtn.disabled = !isCsv;
        parseBtn.style.opacity = isCsv ? '1' : '0.5';
        if (!isCsv) {
            $('corpCompany').innerHTML = '<option value="">Select Company (CSV only)</option>';
        }
    }

    async parseCompanies() {
        if (!corpSelectedFile || !fileIsCSV(corpSelectedFile)) {
            return alert('Please select a CSV file first.');
        }

        const btn = $('btnParseCompanies');
        const originalText = btn.textContent;
        btn.textContent = 'Loading...';
        btn.disabled = true;

        try {
            const formData = new FormData();
            formData.append('file', corpSelectedFile);

            const response = await fetch(`${API_BASE}/parse-csv-companies`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to parse companies');

            const select = $('corpCompany');
            const options = ['<option value="">Select Company</option>'];
            (data.companies || []).forEach(company => {
                options.push(`<option value="${company}">${company}</option>`);
            });
            select.innerHTML = options.join('');
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    async analyzeCorporate() {
        if (!corpSelectedFile) {
            return alert('Please select a file to analyze.');
        }

        const btn = $('btnAnalyzeCorporate');
        const originalText = btn.textContent;
        btn.textContent = 'Analyzing...';
        btn.disabled = true;
        showSpinner();

        try {
            const formData = new FormData();
            formData.append('file', corpSelectedFile);
            const selectedCompany = $('corpCompany').value;
            if (selectedCompany) {
                formData.append('company', selectedCompany);
            }

            const response = await fetch(`${API_BASE}/analyze-corporate`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Analysis failed');
            
            this.displayResults(data);
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
            hideSpinner();
        }
    }

    displayResults(data) {
        $('corpSummary').textContent = data.summary || 'Analysis completed successfully.';
        
        const kpis = data.kpis || {};
        $('kpiRevenue').textContent = formatCurrency(kpis["Total Revenue"]);
        $('kpiIncome').textContent = formatCurrency(kpis["Net Income"]);
        $('kpiEPS').textContent = valOrDash(kpis["EPS"]);
        $('kpiOM').textContent = formatPercentage(kpis["Operating Margin"]);

        this.updateRevenueChart(data.chartData);
        this.updateInsightLists(data.risks, data.opportunities);

        const insightCard = data.insightCard || {};
        $('corpInsightTitle').textContent = insightCard.title || '';
        $('corpInsightExp').textContent = insightCard.explanation || '';

        const resultContainer = $('corpResult');
        show(resultContainer);
        fadeIn(resultContainer);
    }

    updateRevenueChart(chartData) {
        const { labels = [], revenueData = [] } = chartData || {};
        const ctx = $('revenueChart').getContext('2d');
        if (revenueChart) revenueChart.destroy();

        revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Revenue',
                    data: revenueData,
                    borderColor: '#8B7EC8',
                    backgroundColor: 'rgba(139, 126, 200, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#b4b4b4' } } },
                scales: {
                    x: { ticks: { color: '#666666' }, grid: { color: 'rgba(139, 126, 200, 0.1)' } },
                    y: { ticks: { color: '#666666' }, grid: { color: 'rgba(139, 126, 200, 0.1)' } }
                }
            }
        });
    }

    updateInsightLists(risks, opportunities) {
        const convertToHTML = (mdText = '') => mdText.split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => `<li>${line.replace(/^-\s*/, '')}</li>`)
            .join('');

        $('corpRisks').innerHTML = convertToHTML(risks);
        $('corpOpps').innerHTML = convertToHTML(opportunities);
    }
}

class NewsAnalyzer {
    constructor() { this.init(); }
    init() { $('btnFetchNews').addEventListener('click', this.fetchNews.bind(this)); }

    async fetchNews() {
    const company = $('newsCompany').value.trim();
    if (!company) return alert('Please enter a company name.');

    const resultContainer = $('newsResult');
    resultContainer.innerHTML = '<div class="loading-text">Fetching news...</div>';

    try {
        // Create job
        const created = await fetchJson(`${API_BASE}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'live-news', company })
        });

        // Poll job
        const done = await waitForJob(created.job_id, {
            onTick: (j) => {
                resultContainer.innerHTML =
                    `<div class="loading-text">Fetching news... (${j.status})</div>`;
            }
        });

        this.displayNewsResults(done.result || {});

    } catch (error) {
        resultContainer.innerHTML =
            `<div class="error-message">Error: ${error.message}</div>`;
    }
}

    displayNewsResults(data) {
        const sentiment = data.sentiment || 'Neutral';
        const sentimentClass = sentiment === 'Positive' ? 'success' : sentiment === 'Negative' ? 'error' : 'info';
        
        const articles = (data.articles || []).map(article => `
            <div class="news-article">
                <a href="${article.url}" target="_blank" class="article-link">${article.title || 'Untitled'}</a>
                <div class="article-meta">
                    <span class="article-source">${article.source || 'Unknown'}</span>
                    <span class="article-date">${new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');

        const resultContainer = $('newsResult');
        resultContainer.innerHTML = `
            <div class="sentiment-analysis">
                <div class="sentiment-badge ${sentimentClass}">${sentiment}</div>
                <div class="sentiment-summary">${data.summary || ''}</div>
            </div>
            <div class="articles-section">
                <h3 class="section-title">Recent Articles</h3>
                <div class="articles-list">${articles}</div>
            </div>
        `;
        fadeIn(resultContainer);
    }
}

class StockAnalyzer {
    constructor() {
        this.init();
    }

    init() {
        $('btnStockAnalyze')
            .addEventListener('click', this.analyzeStock.bind(this));
    }

    async analyzeStock() {
        const ticker = $('stockTicker').value.trim();
        if (!ticker) return alert('Please enter a stock ticker.');

        const resultContainer = $('stockResult');
        resultContainer.innerHTML =
            '<div class="loading-text">Analyzing stock data...</div>';
        show(resultContainer);

        try {
            const created = await fetchJson(`${API_BASE}/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'stock-analysis',
                    ticker,
                    period: $('stockPeriod').value,
                    interval: $('stockInterval').value,
                    question: $('stockQuestion').value.trim()
                })
            });

            const done = await waitForJob(created.job_id, {
                onTick: (j) => {
                    resultContainer.innerHTML =
                        `<div class="loading-text">
                            Running financial intelligence engine... (${j.status})
                        </div>`;
                }
            });

            this.displayStockResults(done.result || {});

        } catch (error) {
            resultContainer.innerHTML =
                `<div class="error-message">
                    Error: ${error.message}
                </div>`;
        }
    }

}

class IndustryAnalyzer {
    constructor() { this.init(); }
    init() { $('btnIndustryAnalyze').addEventListener('click', this.analyzeIndustry.bind(this)); }

    async analyzeIndustry() {
        const industry = $('industryName').value.trim();
        if (!industry) return alert('Please enter an industry name.');

        const resultContainer = $('industryResult');
        resultContainer.innerHTML = '<div class="loading-text">Analyzing industry...</div>';

        try {
            // Create async job
            const created = await fetchJson(`${API_BASE}/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'industry-analyze', industry, inputs: $('industryInputs').value.trim() })
            });

            // Poll until done
            const done = await waitForJob(created.job_id, {
                onTick: (j) => {
                    resultContainer.innerHTML = `<div class="loading-text">Analyzing industry... <span style="opacity:.8">(${j.status})</span></div>`;
                }
            });

            this.displayIndustryResults(done.result || {});
        } catch (error) {
            resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
        }
    }

    displayIndustryResults(data) {
        const createList = (items = []) => items.map(item => `<li>${item}</li>`).join('');
        $('industryResult').innerHTML = `
            <div class="industry-analysis">
                <div class="analysis-section">
                    <h3 class="section-title">Overview</h3>
                    <p class="analysis-text">${data.overview || 'No overview available.'}</p>
                </div>
                <div class="analysis-section">
                    <h3 class="section-title">Key Drivers</h3>
                    <ul class="analysis-list">${createList(data.drivers)}</ul>
                </div>
                <div class="analysis-section">
                    <h3 class="section-title">Risk Factors</h3>
                    <ul class="analysis-list risks">${createList(data.risks)}</ul>
                </div>
                <div class="analysis-section">
                    <h3 class="section-title">Outlook</h3>
                    <p class="analysis-text">${data.outlook || 'No outlook available.'}</p>
                </div>
                <div class="analysis-section">
                    <h3 class="section-title">Companies to Watch</h3>
                    <ul class="analysis-list watchlist">${createList(data.watchlist)}</ul>
                </div>
            </div>
        `;
        fadeIn($('industryResult'));
    }
}

class SummarizationManager {
    constructor() { this.init(); }
    init() {
        $('btnSummarizeFile').addEventListener('click', this.summarizeFile.bind(this));
        $('btnSummarizeText').addEventListener('click', this.summarizeText.bind(this));
    }

    formatSummary(summaryText) {
        const points = summaryText.split('* **').filter(point => point.trim() !== '');
        if (points.length === 0 && summaryText.length > 0) {
            return `<p>${summaryText}</p>`;
        }
        return `<ul>${points.map(point => {
            const titleEndIndex = point.indexOf('**');
            if (titleEndIndex !== -1) {
                const title = point.substring(0, titleEndIndex).trim();
                const description = point.substring(titleEndIndex + 2).replace(/^:\s*/, '').trim();
                return `<li><strong>${title}:</strong> ${description}</li>`;
            }
            return `<li>${point.trim()}</li>`;
        }).join('')}</ul>`;
    }

    async summarizeFile() {
        const file = $('sumFile').files[0];
        if (!file) return alert('Please select a file to summarize.');
        
        const resultContainer = $('sumResult');
        resultContainer.innerHTML = '<div class="loading-text">Summarizing file...</div>';

        try {
            const formData = new FormData();
            formData.append('type', 'summarize');
            formData.append('file', file);
            formData.append('style', $('sumStyle').value);

            const created = await fetchJson(`${API_BASE}/jobs`, {
                method: 'POST',
                body: formData
            });

            const done = await waitForJob(created.job_id, {
                onTick: (j) => {
                    resultContainer.innerHTML = `<div class="loading-text">Summarizing file... <span style="opacity:.8">(${j.status})</span></div>`;
                }
            });

            const summaryText = (done.result && done.result.summary) ? done.result.summary : '';
            const formattedSummary = this.formatSummary(summaryText);
            resultContainer.innerHTML = `<div class="summary-result">
                <h3 class="section-title">Summary</h3>
                <div class="summary-content">${formattedSummary}</div>
            </div>`;
        } catch (error) {
            resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
        }
    }

    async summarizeText() {
        const text = $('sumText').value.trim();
        if (!text) return alert('Please enter text to summarize.');

        const resultContainer = $('sumResult');
        resultContainer.innerHTML = '<div class="loading-text">Summarizing text...</div>';

        try {
            const created = await fetchJson(`${API_BASE}/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'summarize', text, style: $('sumStyle').value })
            });

            const done = await waitForJob(created.job_id, {
                onTick: (j) => {
                    resultContainer.innerHTML = `<div class="loading-text">Summarizing text... <span style="opacity:.8">(${j.status})</span></div>`;
                }
            });

            const summaryText = (done.result && done.result.summary) ? done.result.summary : '';
            const formattedSummary = this.formatSummary(summaryText);
            resultContainer.innerHTML = `<div class="summary-result">
                <h3 class="section-title">Summary</h3>
                <div class="summary-content">${formattedSummary}</div>
            </div>`;
        } catch (error) {
            resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
        }
    }
}



class WhatIfAnalyzer {
    constructor() { this.init(); }
    init() { $('btnWhatIf').addEventListener('click', this.runScenario.bind(this)); }

    async runScenario() {
        const query = $('whatIfQuery').value.trim();
        if (!query) return alert('Please enter a what-if scenario.');

        const resultContainer = $('whatIfResult');
        resultContainer.innerHTML = '<div class="loading-text">Running scenario analysis...</div>';

        try {
            const created = await fetchJson(`${API_BASE}/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'what-if', query })
            });

            const done = await waitForJob(created.job_id, {
                onTick: (j) => {
                    resultContainer.innerHTML =
                        `<div class="loading-text">Running scenario analysis... <span style="opacity:.8">(${j.status})</span></div>`;
                }
            });

            const answer = done.result?.answer || "No result returned.";

            resultContainer.innerHTML = `
                <div class="whatif-result">
                    <h3 class="section-title">Scenario Analysis</h3>
                    <div class="scenario-content">${answer}</div>
                </div>
            `;
            fadeIn(resultContainer);

        } catch (error) {
            resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
        }
    }
}
class MarketIntelligenceManager {
    constructor() {
        this.btnAnalyze = document.getElementById('btnAnalyzeMarket');
        this.filesInput = document.getElementById('miFiles');
        this.resultContainer = document.getElementById('miResult');
        this.apiBase = API_BASE; 
        this.init();
    }

    init() {
        this.btnAnalyze.addEventListener('click', this.analyzeMarket.bind(this));
    }

    formatBriefing(briefingText) {
        const regex = /\*\*(.*?):\*\*(.*?)(?=\s*\*\*|$)/gs;
        let itemsHtml = '';
        let match;
        while ((match = regex.exec(briefingText)) !== null) {
            const title = match[1].trim();
            const description = match[2].replace(/\*/g, '').trim();
            if (title && description) {
                itemsHtml += `
                    <div class="briefing-item">
                        <div class="briefing-title">${title}</div>
                        <div class="briefing-description">${description}</div>
                    </div>
                `;
            }
        }
        if (itemsHtml === '') {
            return `<div class="briefing-description">${briefingText.replace(/[*#]/g, '')}</div>`;
        }
        return itemsHtml;
    }

    async analyzeMarket() {
        const files = this.filesInput.files;
        if (!files || files.length === 0) {
            return alert('Please select at least one file to analyze.');
        }

        this.resultContainer.innerHTML = '<div class="loading-text">Analyzing market intelligence...</div>';

        try {
            const formData = new FormData();
            for (const file of files) {
                formData.append('files', file);
            }

            const response = await fetch(`${this.apiBase}/analyze-market`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Market analysis failed with status ' + response.status }));
                throw new Error(errorData.error);
            }

            const data = await response.json();
            const formattedBriefing = this.formatBriefing(data.briefing);

            this.resultContainer.innerHTML = `
                <div class="market-intelligence">
                    <h3 class="section-title">Market Intelligence Briefing</h3>
                    <div class="briefing-content">${formattedBriefing}</div>
                </div>
            `;
        } catch (error) {
            this.resultContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
        }
    }
}

// --- Main Application ---

class QuanTaraApp {
    constructor() {
        this.init();
    }

    init() {
        // Initialize all managers
        this.tabManager = new TabManager();
        this.apiStatusManager = new ApiStatusManager();
        this.corporateAnalyzer = new CorporateAnalyzer();
        this.newsAnalyzer = new NewsAnalyzer();
        this.stockAnalyzer = new StockAnalyzer();
        this.industryAnalyzer = new IndustryAnalyzer();
        this.summarizationManager = new SummarizationManager();
        this.whatIfAnalyzer = new WhatIfAnalyzer();
        this.marketIntelligenceManager = new MarketIntelligenceManager();

        this.addGlobalListeners();
        this.addDynamicStyles();
    }

    addGlobalListeners() {
        document.addEventListener('change', (event) => {
            if (event.target.type === 'file') {
                this.updateFileLabel(event.target);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && event.ctrlKey) {
                const activeTab = this.tabManager.activeTab;
                this.handleKeyboardShortcut(activeTab);
            }
        });
    }

    updateFileLabel(input) {
        const label = input.nextElementSibling;
        if (label && label.classList.contains('file-label')) {
            const fileCount = input.files.length;
            if (fileCount > 0) {
                if (fileCount === 1) {
                    label.innerHTML = `<span class="upload-icon">📄</span>${input.files[0].name}`;
                } else {
                    label.innerHTML = `<span class="upload-icon">📁</span>${fileCount} files selected`;
                }
                label.style.color = '#8B7EC8';
            }
        }
    }

    handleKeyboardShortcut(activeTab) {
        const shortcuts = {
            'corporate': () => $('btnAnalyzeCorporate').click(),
            'news': () => $('btnFetchNews').click(),
            'stock': () => $('btnStockAnalyze').click(),
            'industry': () => $('btnIndustryAnalyze').click(),
            'summarization': () => $('btnSummarizeText').click(),
            'whatif': () => $('btnWhatIf').click(),
            'market': () => $('btnAnalyzeMarket').click()
        };
        if (shortcuts[activeTab]) shortcuts[activeTab]();
    }

    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .loading-text {
                color: #8B7EC8;
                text-align: center;
                padding: 20px;
                font-style: italic;
            }
            .error-message {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                color: #ef4444;
                padding: 16px;
                border-radius: 8px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuanTaraApp();
});