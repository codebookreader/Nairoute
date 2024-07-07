const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://buupass.com'; // replace with the specific URL you need to scrape

async function scrapeData() {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // Log the HTML content to debug
        console.log('HTML content:', html);

        // Example: Scraping bus details
        const busDetails = [];

        // Adjust the selector based on the HTML structure
        $('.bus-details').each((index, element) => {
            const busName = $(element).find('.bus-name').text().trim();
            const departureTime = $(element).find('.departure-time').text().trim();
            const seatsAvailable = $(element).find('.seats-available').text().trim();

            console.log('Scraped data:', { busName, departureTime, seatsAvailable });

            busDetails.push({
                busName,
                departureTime,
                seatsAvailable
            });
        });

        // Log the scraped data to debug
        console.log('Final bus details:', busDetails);

        return busDetails;
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        return [];
    }
}

module.exports = scrapeData;