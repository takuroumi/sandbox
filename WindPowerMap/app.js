let map;
let marker;

// 1. Initialize the Map and Click Listener
function initMap() {
    console.log("Map initialized successfully.");
    const defaultLocation = { lat: 35.6762, lng: 139.6503 }; // Tokyo
    
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: defaultLocation,
        mapTypeId: 'terrain'
    });

    // When the map is clicked, update the Lat/Lon input fields
    map.addListener("click", (e) => {
        const clickedLat = e.latLng.lat().toFixed(4);
        const clickedLon = e.latLng.lng().toFixed(4);
        
        document.getElementById("lat").value = clickedLat;
        document.getElementById("lon").value = clickedLon;

        // Move or create a marker to show where you clicked
        if (marker) marker.setMap(null);
        marker = new google.maps.Marker({
            position: e.latLng,
            map: map,
            title: "Selected Location"
        });
    });
}

// 2. Main Calculation Logic
async function calculatePower() {
    // 1. Get Form Values
    const lat = document.getElementById("lat").value;
    const lon = document.getElementById("lon").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const nominalMW = parseFloat(document.getElementById("nominalPower").value);
    const numTurbines = parseInt(document.getElementById("numTurbines").value);
    const cutIn = parseFloat(document.getElementById("cutIn").value);
    const cutOut = parseFloat(document.getElementById("cutOut").value);

    if (!lat || !lon) return alert("Please select a location on the map.");

    const url = `https://power.larc.nasa.gov/api/temporal/hourly/point?start=${startDate}&end=${endDate}&latitude=${lat}&longitude=${lon}&community=re&parameters=WS50M&format=json&units=metric&time-standard=utc`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const windSpeeds = data.properties.parameter.WS50M;

        const rho = 1.225; 
        const Cp = 0.4;    
        const nominalWatts = nominalMW * 1000000;
        const estimatedA = nominalWatts / (0.5 * rho * Math.pow(12, 3) * Cp);

        let csvContent = "Timestamp,Wind Speed [m/s],Single [MW],Total [MW]\n";
        
        // Objects to store daily stats
        let dailyStats = {}; 

        for (const [ts, ws] of Object.entries(windSpeeds)) {
            let powerWatts = 0.5 * rho * estimatedA * Math.pow(ws, 3) * Cp;

            // Apply User-Defined Parameters
            if (ws < cutIn || ws > cutOut) {
                powerWatts = 0;
            } else if (powerWatts > nominalWatts) {
                powerWatts = nominalWatts;
            }

            const singleMW = powerWatts / 1000000;
            const totalMW = singleMW * numTurbines;

            // Save to CSV string
            csvContent += `${ts},${ws},${singleMW.toFixed(4)},${totalMW.toFixed(4)}\n`;

            // Group by Date (YYYYMMDD) for the Table
            const dateKey = ts.substring(0, 8); 
            if (!dailyStats[dateKey]) {
                dailyStats[dateKey] = { totalMW: 0, totalWS: 0, count: 0 };
            }
            dailyStats[dateKey].totalMW += totalMW;
            dailyStats[dateKey].totalWS += ws;
            dailyStats[dateKey].count += 1;
        }

        updateSummaryTable(dailyStats);
        downloadCSV(csvContent);

    } catch (error) {
        console.error(error);
        alert("Calculation failed. Check console for details.");
    }
}

function downloadCSV(content) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "wind_power_estimation.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateSummaryTable(dailyStats) {
    const summaryBody = document.getElementById("summaryBody");
    const container = document.getElementById("resultsSummary");
    summaryBody.innerHTML = ""; // Clear old results
    container.style.display = "block"; // Show table

    for (const [date, stats] of Object.entries(dailyStats)) {
        const avgWS = (stats.totalWS / stats.count).toFixed(2);
        const dailyTotalMWh = stats.totalMW.toFixed(2); // Since data is hourly, Sum(MW) = MWh
        const avgMW = (stats.totalMW / stats.count).toFixed(2);

        const row = `<tr>
            <td>${date}</td>
            <td>${avgWS}</td>
            <td>${dailyTotalMWh}</td>
            <td>${avgMW}</td>
        </tr>`;
        summaryBody.innerHTML += row;
    }
}