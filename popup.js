// popup.js
document.addEventListener('DOMContentLoaded', function() {
// Scan for pixels when popup is opened
    scanForPixels();

// Set up the scan button
    document.getElementById('scan').addEventListener('click', scanForPixels);
});

function scanForPixels() {
    const loadingElement = document.getElementById('loading');
    const resultsElement = document.getElementById('results');

    loadingElement.style.display = 'block';
    resultsElement.style.display = 'none';
    resultsElement.innerHTML = '';

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: detectPixels
        }, (results) => {
            loadingElement.style.display = 'none';
            resultsElement.style.display = 'block';

            const pixels = results[0].result;

            if (Object.keys(pixels).length === 0) {
                resultsElement.innerHTML = '<p>No marketing pixels detected on this page.</p>';
                return;
            }

            for (const [name, status] of Object.entries(pixels)) {
                const pixelItem = document.createElement('div');
                pixelItem.className = 'pixel-item';

                const pixelName = document.createElement('div');
                pixelName.className = 'pixel-name';
                pixelName.textContent = name;

                const pixelStatus = document.createElement('div');
                pixelStatus.className = `status ${status ? 'active' : 'inactive'}`;
                pixelStatus.textContent = status ? 'Active' : 'Not Found';

                pixelItem.appendChild(pixelName);
                pixelItem.appendChild(pixelStatus);
                resultsElement.appendChild(pixelItem);
            }
        });
    });
}

function detectPixels() {
// This function runs in the context of the active tab
    const pixels = {
        'Facebook Pixel': false,
        'Google Analytics': false,
        'Google Tag Manager': false,
        'TikTok Pixel': false,
        'Snapchat Pixel': false,
        'Twitter Pixel': false,
        'LinkedIn Pixel': false,
        'Pinterest Tag': false
    };

// Check for Facebook Pixel
    if (
        typeof fbq !== 'undefined' ||
        document.querySelector('script[src*="connect.facebook.net"]') ||
        document.querySelector('noscript[class*="facebook"]')
    ) {
        pixels['Facebook Pixel'] = true;
    }

// Check for Google Analytics
    if (
        typeof ga !== 'undefined' ||
        typeof gtag !== 'undefined' ||
        document.querySelector('script[src*="google-analytics.com"]')
    ) {
        pixels['Google Analytics'] = true;
    }

// Check for Google Tag Manager
    if (
        typeof dataLayer !== 'undefined' ||
        document.querySelector('script[src*="googletagmanager.com"]')
    ) {
        pixels['Google Tag Manager'] = true;
    }

// Check for TikTok Pixel
    if (
        typeof ttq !== 'undefined' ||
        document.querySelector('script[src*="analytics.tiktok.com"]')
    ) {
        pixels['TikTok Pixel'] = true;
    }

// Check for Snapchat Pixel
    if (
        typeof snaptr !== 'undefined' ||
        document.querySelector('script[src*="sc-static.net"]')
    ) {
        pixels['Snapchat Pixel'] = true;
    }

// Check for Twitter Pixel
    if (
        typeof twq !== 'undefined' ||
        document.querySelector('script[src*="static.ads-twitter.com"]')
    ) {
        pixels['Twitter Pixel'] = true;
    }

// Check for LinkedIn Pixel
    if (
        typeof _linkedin_data_partner_ids !== 'undefined' ||
        document.querySelector('script[src*="_linkedin_partner_id"]')
    ) {
        pixels['LinkedIn Pixel'] = true;
    }

// Check for Pinterest Tag
    if (
        typeof pintrk !== 'undefined' ||
        document.querySelector('script[src*="pinimg.com/ct"]')
    ) {
        pixels['Pinterest Tag'] = true;
    }

    return pixels;
}