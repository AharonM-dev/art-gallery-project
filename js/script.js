$(document).ready(function() {
    // מזהה את כפתור החיפוש
    $('#searchBtn').on('click', function() {
        // מנקה את תוצאות החיפוש הקודמות
        $('#resultsContainer').empty();
        
        // מקבל את מילת המפתח מהשדה
        let searchTerm = $('#searchInput').val();

        // מוודא שהמשתמש הזין משהו לפני שממשיכים
        if (searchTerm.length > 0) {
            // קורא לפונקציה שמבצעת את קריאת ה-API
            searchArt(searchTerm);
        } else {
            // אם שדה החיפוש ריק, מציג הודעה
            $('#resultsContainer').html('<div class="col-12 text-center">אנא הזן מילת מפתח לחיפוש.</div>');
        }
    });

    function searchArt(query) {
        // בונה את כתובת ה-API לקבלת מזהי אובייקטים (Object IDs)
        const searchApiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`;

        // קריאה ראשונית ל-API כדי לקבל רשימת מזהי יצירות
        $.getJSON(searchApiUrl, function(data) {
            // מוודא שיש תוצאות
            if (data.total > 0) {
                // לוקח רק את 20 התוצאות הראשונות כדי למנוע טעינה איטית
                const objectIds = data.objectIDs.slice(0, 20);
                
                // עובר על כל מזהה ומבצע קריאה נוספת כדי לקבל את פרטי היצירה
                objectIds.forEach(function(objectId) {
                    const objectApiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
                    
                    $.getJSON(objectApiUrl, function(objectData) {
                        // אם יש תמונה ליצירה, מציג אותה
                        if (objectData.primaryImageSmall) {
                            displayArtCard(objectData);
                        }
                    });
                });
            } else {
                // אם אין תוצאות, מציג הודעה מתאימה
                $('#resultsContainer').html('<div class="col-12 text-center">לא נמצאו תוצאות עבור החיפוש.</div>');
            }
        });
    }

    function displayArtCard(artObject) {
        // בונה את כרטיס היצירה באמצעות string template
        const cardHtml = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${artObject.primaryImageSmall}" class="card-img-top" alt="${artObject.title}">
                    <div class="card-body">
                        <h5 class="card-title">${artObject.title}</h5>
                        <p class="card-text">${artObject.artistDisplayName ? artObject.artistDisplayName : 'אמן לא ידוע'}</p>
                        <button class="btn btn-sm btn-info text-white details-btn" data-bs-toggle="modal" data-bs-target="#artModal" data-object-id="${artObject.objectID}">פרטים נוספים</button>
                    </div>
                </div>
            </div>
        `;
        // מוסיף את הכרטיס למכולת התוצאות
        $('#resultsContainer').append(cardHtml);
    }
});