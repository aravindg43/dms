     // Import the validation function from validations.js
     import { formvalidations  } from './validations.js';


     function fetchCities(stateId, selectedCityId = null) {
         fetch('http://77.37.45.2:1000/api/v1/city/fetchallcity')
 
             .then(response => response.json())
             .then(cities => {
                 const cityDropdown = document.getElementById('cityDropdown');
                 cityDropdown.innerHTML = '<option value="">Select City</option>'; // Reset city dropdown
     
                 // Filter cities based on stateId and populate the city dropdown
                 cities.filter(city => city.stateValueId === stateId).forEach(city => {
                     const option = document.createElement('option');
                     option.value = city.id;
                     option.textContent = city.name;
                     cityDropdown.appendChild(option);
                 });
     
                 // If editing, select the city that matches the hospital's city
                 if (selectedCityId) {
                     cityDropdown.value = selectedCityId;
                 }
             })
             .catch(error => console.error('Error fetching cities:', error));
     }
     
 
 // Fetch hospitals and populate the table
 function fetchHospitals() {
 
     fetch('http://77.37.45.2:1000/api/v1/hospitalregistration/fetchallhospitalregistrations')
         .then(response => response.json())
         .then(hospitals => {
             // Clear existing rows
             const hospitalTableBody = document.querySelector('#hospital-body');
             hospitalTableBody.innerHTML = '';
 
             // Fetch states
             fetch('http://77.37.45.2:1000/api/v1/state/fetchallstate')
                 .then(response => response.json())
                 .then(states => {
                     // Fetch cities
                     fetch('http://77.37.45.2:1000/api/v1/city/fetchallcity')
                         .then(response => response.json())
                         .then(cities => {
 
                             // Populate the table with hospitals
                             hospitals.forEach((hospital, index) => {
                                 let stateName = 'Unknown State';
                                 let cityName = 'Unknown City';
 
                                 // Find the corresponding state by ID
                                 states.forEach(state => {
                                     if (hospital.state && state.id === hospital.state.id) {
                                         stateName = state.name;
                                     }
                                 });
 
                                 // Find the corresponding city by ID
                                 cities.forEach(city => {
                                     if (hospital.city && city.id === hospital.city.id) {
                                         cityName = city.name;
                                     }
                                 });
 
 
                                 const row = document.createElement('tr');
                                 row.innerHTML = `
                                     <td class="text-center">${index + 1}</td>
                                     <td class="text-center">${hospital.name}</td>
                                     <td class="text-center">${hospital.email}</td>
                                     <td class="text-center">${hospital.phone}</td>
                                     <td class="text-center">${hospital.address}</td>
                                     <td class="text-center">${hospital.location}</td>
                                     <td class="text-center">${stateName}</td>
                                     <td class="text-center">${cityName}</td>
                                     <td class="text-center">${hospital.pincode}</td>
                                    <td>
                                         
                                             <i class="fas fa-edit icon edit large-icon" title="Edit" onclick="editHosp(${hospital.id})"></i>
                                             <span class="vertical-divider"></span>
                                             <i class="fas fa-trash-alt icon delete large-icon" title="Delete" onclick="deleteHospital(${hospital.id})"></i>
                                         
                                     </td>
                                 `;
                                 
 
 
 
 
                                 hospitalTableBody.appendChild(row);
 
                             });
 
                         })
                         .catch(error => console.error('Error fetching cities:', error));
                 })
                 .catch(error => console.error('Error fetching states:', error));
         })
         .catch(error => console.error('Error fetching hospitals:', error));
 }
 
 
     // Define the editHosp function in the global scope
     window.editHosp = function(hospitalId) {
         console.log(hospitalId);
         
         document.getElementById('tableid').style.display = 'none';
         document.getElementById('form-container').style.display = 'block';
         
         // Heading
         document.getElementById('editformid').style.display = 'block';
         document.getElementById('formHeading').style.display = 'none';
         
         // Button
         document.getElementById('formSubmitBtn').style.display = 'none';
         document.getElementById('fromUpdateBtn').style.display = 'block';
         
         
 
 
     // Fetch the hospital details and populate the form (You need to implement this)
     fetch(`http://77.37.45.2:1000/api/v1/hospitalregistration/fetchhospitalregistration/${hospitalId}`)
         .then(response => response.json())
         .then(hospital => {
             document.getElementById('hospitalName').value = hospital.name;
             document.getElementById('hospitalEmail').value = hospital.email;
             document.getElementById('hospitalPhone').value = hospital.phone;
             document.getElementById('hospitalLocation').value = hospital.location;
             document.getElementById('hospitalAddress').value = hospital.address;
             document.getElementById('hospitalPincode').value = hospital.pincode;
 
             // Set selected state and city if they exist
             document.getElementById('stateDropdown').value = hospital.state.id;
 
             // Fetch cities for the selected state and set the selected city
             fetchCities(hospital.state.id, hospital.city.id);
             
         })
         .catch(error => console.error('Error fetching hospital details:', error));
 
 
 
 
 // Remove any existing event listeners from the update button
  let updateBtn = document.getElementById('fromUpdateBtn');
  updateBtn.replaceWith(updateBtn.cloneNode(true));  // Removes previous event listeners
  updateBtn = document.getElementById('fromUpdateBtn'); // Get the new clone              
 
 
    
 
 document.getElementById('fromUpdateBtn').addEventListener("click", function(event){
             event.preventDefault();
             
             let valid = formvalidations();
         
             if(valid){
                 const stateId = parseInt(document.getElementById('stateDropdown').value);
                 const cityId = parseInt(document.getElementById('cityDropdown').value);
         
                 const hospitalData = {
                     name: document.getElementById('hospitalName').value,
                     email: document.getElementById('hospitalEmail').value,
                     phone: document.getElementById('hospitalPhone').value,
                     stateId: stateId,
                     cityId: cityId,
                     location: document.getElementById('hospitalLocation').value,
                     address: document.getElementById('hospitalAddress').value,
                     pincode: document.getElementById('hospitalPincode').value
                 };
         
                 // Pass hospitalId to the update function
                 putHospitalUpdate(hospitalData, hospitalId);
         
                 // Show the table and hide the form
                 document.getElementById('tableid').style.display = 'block';
                 document.getElementById('form-container').style.display = 'none';
             } else {
                 console.log("Some Error");
             }
         });
         
 
 
 
 
     function putHospitalUpdate(hospitalData, hospitalId) {
 
         let url1 = `http://77.37.45.2:1000/api/v1/hospitalregistration/updatehospitalregistration/${hospitalId}`;
 
         console.log(hospitalId);
         
 
         fetch(url1 ,{
             
             method : "PUT",
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(hospitalData)
             })
             .then(response => response.json())
             .then(result => {
                 console.log('Hospital Updated successfully:', result);
 
                 // Refresh the hospital table after successful Update
                 fetchHospitals();
                 
             })
             .catch(error => console.error('Error Updating hospital:', error));
     }   
 
  
  };
 
 
  
 
 // Event listener for DOMContentLoaded to set up initial states and event listeners
 document.addEventListener('DOMContentLoaded', () => {
   const backArrow = document.querySelector('.navbar-toggler-icon');
   const sidebar = document.getElementById('sidebar');
   const mainContent = document.getElementById('main-content');
   const collapseBtn = document.getElementById('collapse-btn');
   const navbar = document.querySelector('.navbar');
   const formContainer = document.getElementById('form-container');
   const hospitalForm = document.getElementById('hospitalForm');
   const formSubmitBtn = document.getElementById('formSubmitBtn');
   const hospitalBody = document.getElementById('hospital-body');
   const updateBtn = document.getElementById('fromUpdateBtn');
   const hospTable = document.getElementById('hospital-table');
   const searchInput = document.getElementById('searchInput');
 
   formContainer.style.display = 'none'; // Initially hide the form
   mainContent.classList.add('full-width'); // Start with full-width layout
 
 
       // Toggle sidebar visibility and adjust layout on backArrow click
       backArrow.addEventListener('click', () => {
         sidebar.classList.toggle('visible');
         mainContent.classList.toggle('full-width');
         navbar.classList.toggle('shifted');
         backArrow.setAttribute('aria-expanded', sidebar.classList.contains('visible'));
       });
 
       // Toggle sidebar visibility and adjust layout on collapseBtn click
       collapseBtn.addEventListener('click', () => {
           sidebar.classList.toggle('visible');
           mainContent.classList.toggle('full-width');
           navbar.classList.toggle('shifted');
       });
 
       // Show the form and hide the table when "Add Hospital" button is clicked
       document.getElementById('addh').addEventListener('click', function() {
           document.getElementById('tableid').style.display = 'none'; // Hide the table
           document.getElementById('form-container').style.display = 'block'; // Show the form  
           document.getElementById("formSubmitBtn").style.display = 'block'; 
           document.getElementById('formHeading').style.display = 'block'; 
           document.getElementById('editformid').style.display = 'none'; 
           document.getElementById('fromUpdateBtn').style.display = 'none'; 
       });
 
       // Close the form and show the table when the "Close" button is clicked
       document.getElementById('closeModalBtn').addEventListener('click', function() {
           document.getElementById('hospitalForm').reset();
           document.getElementById('form-container').style.display = 'none'; // Hide the form
           document.getElementById('tableid').style.display = 'block'; // Show the table
       });
 
       // Search Functionality in Table
       searchInput.addEventListener('input', () => {
           const searchValue = searchInput.value.toLowerCase();
           const rows = hospitalBody.querySelectorAll('tr');
             rows.forEach(row => {
                 const cells = Array.from(row.getElementsByTagName('td'));
                 const match = cells.some(cell => cell.textContent.toLowerCase().includes(searchValue));
                 row.style.display = match ? '' : 'none';
             });
       });
   
 
 
 
   
 
   // Post a new hospital registration
   function postHospitalRegistration(hospitalData) {
       fetch('http://77.37.45.2:1000/api/v1/hospitalregistration/savehospitalregistration', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(hospitalData)
       })
       .then(response => response.json())
       .then(result => {
           console.log('Hospital registered successfully:', result);
 
           // Refresh the hospital table after successful registration
           fetchHospitals();
           
       })
       .catch(error => console.error('Error registering hospital:', error));
   }
 
 // Fetch states and populate the state dropdown
 function fetchStates() {
    fetch('http://77.37.45.2:1000/api/v1/state/fetchallstate')
        .then(response => response.json())
        .then(states => {
            const stateDropdown = document.getElementById('stateDropdown');
            
            // Populate the state dropdown
            states.forEach(state => {
                const option = document.createElement('option');
                option.value = state.id;
                option.textContent = state.name;
                stateDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching states:', error));
}



// When a state is selected, load the cities
document.getElementById('stateDropdown').addEventListener('change', function() {
 const stateId = parseInt(this.value);
 if (stateId) {
     fetchCities(stateId);
 } else {
     document.getElementById('cityDropdown').innerHTML = '<option value="">Select City</option>';
 }
});
 
 
 
 
 
   //Hospital Record is Created when submit button is clicked in the form 
   document.getElementById('formSubmitBtn').addEventListener('click', function(event) {
         
         event.preventDefault();
 
         
         let valid = formvalidations();
 
         if(valid){
 
                 const stateId = parseInt(document.getElementById('stateDropdown').value);
                 const cityId = parseInt(document.getElementById('cityDropdown').value);
 
                 const hospitalData = {
                     name: document.getElementById('hospitalName').value,
                     email: document.getElementById('hospitalEmail').value,
                     phone: document.getElementById('hospitalPhone').value,
                     stateId: stateId,
                     cityId: cityId,
                     location: document.getElementById('hospitalLocation').value,
                     address: document.getElementById('hospitalAddress').value,
                     pincode: document.getElementById('hospitalPincode').value
                 };
 
                 // Post the hospital data to the server
                 postHospitalRegistration(hospitalData);
                 document.getElementById('tableid').style.display = 'block'; // Show the table
                 document.getElementById('form-container').style.display = 'none'; // Hide the form
         }else{
             console.log("Some Error")
         }
 
            
         
     });
 
 
 
 
   // Fetch states and hospitals when the page loads
   fetchStates();
   fetchHospitals();
 
 });
 
 
 
 
 
 
 
 