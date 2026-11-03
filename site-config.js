// Configuration File - Easy Content Management
// Edit this file to add/remove/modify blog posts, services, products, and tools

window.SITE_CONFIG = {
    // Blog Posts
    blogPosts: [
        {
            id: 5,
            title: "Is Renting Really 'Dead Money' in the UK? What the Data Shows",
            excerpt: "We compared renting and buying the same home in 12 UK regions and 316 local authorities, with a 2005-2026 backtest. Mortgage interest is dead money too: buying wins in 1.4-4.1 years if prices rise 3% a year, and takes 11 to 30+ years if they don't. Python and R code, data and a calculator.",
            image: "blog/charts/rent-vs-buy-breakeven-years-by-region-uk-2026.svg",
            date: "2026-10-23",
            category: "Data Journalism",
            sponsored: false,
            readTime: "18 min read",
            link: "blog/is-renting-dead-money-uk.html"
        },
		{
            id: 1,
            title: "Which Jobs Is AI Actually Replacing? What the Data Shows",
            excerpt: "We matched AI exposure scores to US employment for 722 occupations and ran a pre-ChatGPT placebo test. Exposure explains about 1% of the change in jobs from 2019 to 2025. Original analysis with charts, data, Python and R code.",
            image: "blog/charts/ai-exposure-vs-employment-change-scatter-2019-2025.svg",
            date: "2026-09-17",
            category: "Data Journalism",
            sponsored: false,
            readTime: "16 min read",
            link: "blog/which-jobs-is-ai-actually-replacing.html"
        },
        {
			id: 2,  // Adjust this ID based on your existing posts
			title: "Understanding Statistical Significance in A/B Testing",
			excerpt: "Learn how to properly interpret statistical significance in A/B testing with practical Python and R examples. Master p-values, confidence intervals, and avoid common pitfalls that invalidate results.",
			image: null,
			date: "2025-11-29",
			category: "Statistics",
			sponsored: false,
			readTime: "12 min read",
			link: "blog/statistical-significance-ab-testing.html"
		},
        {
			id: 3,  // Adjust this ID based on your existing posts (should be next sequential number)
			title: "How to Select a Machine Learning Model",
			excerpt: "Master the art of choosing the right ML algorithm with our comprehensive guide. Learn decision frameworks, compare popular models, and implement systematic evaluation in Python and R.",
			image: null,
			date: "2025-11-29",
			category: "Machine Learning",
			sponsored: false,
			readTime: "15 min read",
			link: "blog/how-to-select-machine-learning-model.html"
		}
		
    ],

    // Services
    services: [
        {
            id: 1,
            icon: "📊",
            title: "Data Analysis & Insights",
            description: "Transform your raw data into actionable insights with comprehensive statistical analysis and visualization.",
            features: [
                "Exploratory Data Analysis",
                "Statistical Modeling",
                "Data Visualization",
                "Custom Reporting"
            ],
            cta: "Learn More"
        },
        {
            id: 2,
            icon: "🤖",
            title: "Machine Learning Solutions",
            description: "Build predictive models and automated systems to solve complex business problems.",
            features: [
                "Predictive Analytics",
                "Classification Models",
                "Regression Analysis",
                "Model Deployment"
            ],
            cta: "Learn More"
        },
        {
            id: 3,
            icon: "💼",
            title: "Data Consultancy",
            description: "Expert guidance on data strategy, architecture, and best practices for your organization.",
            features: [
                "Data Strategy Planning",
                "Process Optimization",
                "Tool Selection",
                "Team Training"
            ],
            cta: "Get Started",
            transparency: {
                title: "Transparency Note",
                message: "I'm building my consultancy practice and currently establishing my presence in the data analytics market. While I'm new to offering professional services, I bring strong analytical skills and a commitment to delivering quality work. I'm transparent about my experience level and focus on providing value through rigorous analysis and continuous learning."
            }
        }
    ],

    // Digital Products
    // price: { amount, currency } is shown in each visitor's local currency (js/currency.js).
    products: [
        {
            id: 4,
            icon: "📘",
            image: "books/prompt-engineering-for-production-systems/cover-300.jpg",
            title: "Prompt Engineering for Production Systems",
            category: "E-Book",
            description: "A practitioner's guide to taking LLM prompts from prototype to production: versioning, evaluation, regression testing, reliability, observability, security and governance.",
            features: [
                "180 pages, 12 chapters plus a pattern library and checklists",
                "Read online, or download the PDF and EPUB",
                "First two chapters free to read",
                "One-time payment, no DRM"
            ],
            price: { amount: 5.99, currency: "GBP" },
            period: "one-time",
            badge: "New",
            available: true,
            link: "books/prompt-engineering-for-production-systems/index.html",
            previewLink: "books/prompt-engineering-for-production-systems/preview/index.html",
            // Paste the Gumroad product URL here once the product is live, e.g.
            // "https://truthwithdata.gumroad.com/l/prompt-engineering". Until then the
            // Buy buttons fall back to an email enquiry.
            checkoutUrl: "",
            // Also sold on Amazon (Kindle edition)
            amazonUrl: "https://www.amazon.de/dp/B0HHMZGCYY"
        },
        {
            id: 5,
            icon: "🏠",
            title: "Personalised Rent vs Buy Report",
            category: "Personalised Report",
            description: "Your own 9-page PDF, typeset from your numbers in the Rent vs Buy Calculator: tipping points, stress tests, what happened to buyers in your region since 2005, and your options compared.",
            features: [
                "Built on your price, rent, deposit and stay",
                "Stress tests and 21 years of regional history",
                "Checklist for your mortgage broker",
                "Instant download; re-run up to 10 times"
            ],
            price: { amount: 5.99, currency: "GBP" },
            period: "one-time",
            badge: "New",
            available: true,
            link: "tools/rent-vs-buy-calculator.html#report",
            previewLink: "reports/samples/rent-vs-buy-sample-report.pdf",
            previewText: "See a sample report (PDF)",
            // Buyers first enter their numbers in the calculator, so "Buy" goes there
            buyLink: "tools/rent-vs-buy-calculator.html#report",
            buyText: "Get your report",
            linkText: "Open the calculator",
            // Gumroad product. The calculator's report panel shows the Buy button when this is set.
            checkoutUrl: "https://truthwithdata.gumroad.com/l/rent-vs-buy-report"
        },
        {
            id: 1,
            icon: "📘",
            title: "Data Analysis Fundamentals",
            category: "E-Book",
            description: "A comprehensive guide to statistical analysis and data interpretation for beginners and intermediate analysts.",
            features: [
                "150+ pages of content",
                "Real-world examples",
                "Practice datasets",
                "Lifetime updates"
            ],
            price: { amount: 29, currency: "USD" },
            period: "one-time",
            badge: "Coming Soon",
            available: false,
            link: "#"
        },
        {
            id: 2,
            icon: "🎓",
            title: "Python for Data Science",
            category: "Online Course",
            description: "Learn Python programming for data analysis, visualization, and machine learning from scratch.",
            features: [
                "40+ video lessons",
                "Hands-on projects",
                "Certificate of completion",
                "Community access"
            ],
            price: { amount: 99, currency: "USD" },
            period: "one-time",
            badge: "Coming Soon",
            available: false,
            link: "#"
        },
        {
            id: 3,
            icon: "📊",
            title: "Excel Analytics Templates",
            category: "Templates",
            description: "Professional Excel templates for business analytics, reporting, and dashboards.",
            features: [
                "10+ ready-to-use templates",
                "Customizable dashboards",
                "Formula libraries",
                "Video tutorials"
            ],
            price: { amount: 19, currency: "USD" },
            period: "one-time",
            badge: "Coming Soon",
            available: false,
            link: "#"
        }
    ],

    // Case studies (homepage section; full pages are built by scripts/build_case_studies.py)
    caseStudies: [
        {
            kicker: "Machine learning · NLP",
            metric: "1%",
            metricLabel: "of today's AI reviews caught by a detector trained on 2019's fakes",
            title: "Can a model spot an AI-written review?",
            summary: "A detector that catches 86% of AI reviews while wrongly flagging 1% of genuine ones, and a live demo you can try.",
            tags: ["Machine learning", "NLP", "Trust and safety"],
            link: "case-studies/detecting-ai-written-reviews.html"
        },
        {
            kicker: "Simulation · Financial modelling",
            metric: "1.4–30+",
            metricLabel: "years for buying to beat renting, depending on place and prices",
            title: "Is renting really \"dead money\"? A decision model tested against 21 years of history",
            summary: "A month-by-month simulation of a six-figure decision, a 2005–2026 backtest and a calculator anyone can use.",
            tags: ["Simulation", "Backtesting", "Python and R"],
            link: "case-studies/rent-vs-buy-decision-model.html"
        },
        {
            kicker: "Causal inference · Econometrics",
            metric: "r = 0.01",
            metricLabel: "correlation between AI exposure and job change, 2019–2025",
            title: "Is AI taking jobs? Testing the claim on 722 occupations",
            summary: "Linking AI usage to employment, controlling for confounders, and a placebo test that shows the headline effect predates ChatGPT.",
            tags: ["Causal inference", "Placebo test", "Data linkage"],
            link: "case-studies/ai-and-jobs-causal-analysis.html"
        },
        {
            kicker: "Experimentation · Monte Carlo",
            metric: "24.6%",
            metricLabel: "of no-difference tests call a winner when checked daily",
            title: "Your A/B test \"winner\" may be noise: what 100,000 simulated tests show",
            summary: "The most common A/B testing mistake, measured, and a stopping rule that lets you look every day without fooling yourself.",
            tags: ["A/B testing", "Monte Carlo", "Sequential testing"],
            link: "case-studies/ab-testing-peeking-simulation.html"
        }
    ],

    // Tools & Calculators
    tools: [
        {
            id: 1,
            icon: "🧮",
            title: "Sample Size Calculator",
            description: "Calculate the required sample size for your statistical experiments and surveys.",
            link: "tools/sample-size-calculator.html"
        },
        {
            id: 2,
            icon: "📈",
            title: "ROI Calculator",
            description: "Calculate return on investment for your business projects and marketing campaigns.",
            link: "tools/roi-calculator.html"
        },
		{
			id: 5,
			title: "Descriptive Statistics",
			description: "Calculate mean, median, mode, range, and other key statistics for your dataset",
			icon: "📊",
			category: "statistical-analysis",
			link: "tools/descriptive-stats-calculator.html"
		},
		{
			id: 6,
			title: "Standard Deviation & Variance",
			description: "Measure the spread and variability in your data with population or sample calculations",
			icon: "📈",
			category: "statistical-analysis",
			link: "tools/std-dev-variance-calculator.html"
		},
		{
			id: 7,
			title: "Percentile & Quartile",
			description: "Find quartiles, percentiles, and visualize your data distribution",
			icon: "📊",
			category: "statistical-analysis",
			link: "tools/percentile-quartile-calculator.html"
		},
		{
			id: 8,
			title: "Correlation Coefficient",
			description: "Calculate Pearson and Spearman correlation to measure relationships between variables",
			icon: "🔗",
			category: "statistical-analysis",
			link: "tools/correlation-calculator.html"
		},
		{
			id: 9,
			title: "Covariance Calculator",
			description: "Measure how two variables change together with population or sample covariance",
			icon: "📉",
			category: "statistical-analysis",
			link: "tools/covariance-calculator.html"
		},
		{
            id: 10,
            title: "AI Job Exposure Checker",
            description: "Look up any of 787 occupations: AI exposure score, employment change 2019-2025, pre-ChatGPT trend, and how similar jobs fared",
            icon: "🤖",
            category: "labour-market",
            link: "tools/ai-job-exposure-checker.html"
        },
        {
            id: 11,
            title: "Rent vs Buy Calculator (UK)",
            description: "When does buying beat renting where you live? Regional price and rent presets from July 2026 data, stamp duty, LBTT and LTT, break-even year and net wealth over 30 years",
            icon: "🏠",
            category: "housing",
            link: "tools/rent-vs-buy-calculator.html"
        }
    ],

    // Contact Information
    contact: {
        emails: ["truthwithdata@gmail.com", "vishalsharma3003@gmail.com"],
        responseTime: "Within 24-48 hours"
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SITE_CONFIG;
}
